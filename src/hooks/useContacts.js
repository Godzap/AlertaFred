import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useContacts(filters = {}) {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const fetchContacts = useCallback(async () => {
        setLoading(true)

        let allowedIds = null

        if (filters.theme_id) {
            const { data } = await supabase
                .from('contact_themes')
                .select('contact_id')
                .eq('theme_id', filters.theme_id)
            allowedIds = (data ?? []).map(r => r.contact_id)
            if (allowedIds.length === 0) {
                setContacts([])
                setTotal(0)
                setLoading(false)
                return
            }
        }

        if (filters.tag_id) {
            const { data } = await supabase
                .from('contact_tags')
                .select('contact_id')
                .eq('tag_id', filters.tag_id)
            const tagIds = (data ?? []).map(r => r.contact_id)
            if (tagIds.length === 0) {
                setContacts([])
                setTotal(0)
                setLoading(false)
                return
            }
            allowedIds = allowedIds
                ? allowedIds.filter(id => tagIds.includes(id))
                : tagIds
        }

        let query = supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false })

        if (filters.status) query = query.eq('status', filters.status)
        if (filters.search) {
            const q = filters.search
            query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
        }
        if (allowedIds) query = query.in('id', allowedIds)

        const page = filters.page || 1
        const perPage = filters.perPage || 20
        query = query.range((page - 1) * perPage, page * perPage - 1)

        const { data: contactsData, error } = await query

        if (error) {
            console.error('useContacts fetch error:', error)
            setLoading(false)
            return
        }

        const ids = (contactsData ?? []).map(c => c.id)
        const themesMap = {}
        const tagsMap = {}

        if (ids.length > 0) {
            const [{ data: ctData }, { data: ctgData }] = await Promise.all([
                supabase.from('contact_themes').select('contact_id, themes(id, name, color)').in('contact_id', ids),
                supabase.from('contact_tags').select('contact_id, tags(id, name, color)').in('contact_id', ids),
            ])

            ;(ctData ?? []).forEach(row => {
                if (!themesMap[row.contact_id]) themesMap[row.contact_id] = []
                if (row.themes) themesMap[row.contact_id].push(row.themes)
            })
            ;(ctgData ?? []).forEach(row => {
                if (!tagsMap[row.contact_id]) tagsMap[row.contact_id] = []
                if (row.tags) tagsMap[row.contact_id].push(row.tags)
            })
        }

        setContacts((contactsData ?? []).map(c => ({
            ...c,
            themes: themesMap[c.id] ?? [],
            tags: tagsMap[c.id] ?? [],
        })))
        setTotal(contactsData?.length ?? 0)
        setLoading(false)
    }, [filters.status, filters.theme_id, filters.tag_id, filters.search, filters.page, filters.perPage])

    useEffect(() => { fetchContacts() }, [fetchContacts])

    const createContact = async ({ themes = [], tags = [], theme_ids = [], tag_ids = [], ...payload }) => {
        const user_id = await getCurrentUserId()
        const { data: contact, error } = await supabase
            .from('contacts')
            .insert({ status: 'active', source: 'manual', ...payload, user_id })
            .select()
            .single()
        if (error || !contact) {
            console.error('createContact error:', error)
            return null
        }

        const themeList = themes.length > 0 ? themes.map(t => t.id ?? t) : theme_ids
        const tagList = tags.length > 0 ? tags.map(t => t.id ?? t) : tag_ids

        if (themeList.length > 0) {
            await supabase.from('contact_themes').insert(
                themeList.map(id => ({ contact_id: contact.id, theme_id: id }))
            )
        }
        if (tagList.length > 0) {
            await supabase.from('contact_tags').insert(
                tagList.map(id => ({ contact_id: contact.id, tag_id: id }))
            )
        }

        await fetchContacts()
        return contact
    }

    const updateContact = async (id, { themes, tags, theme_ids, tag_ids, ...payload }) => {
        if (Object.keys(payload).length > 0) {
            await supabase
                .from('contacts')
                .update({ ...payload, updated_at: new Date().toISOString() })
                .eq('id', id)
        }

        const themeList = themes !== undefined ? themes.map(t => t.id ?? t)
            : theme_ids !== undefined ? theme_ids : undefined
        const tagList = tags !== undefined ? tags.map(t => t.id ?? t)
            : tag_ids !== undefined ? tag_ids : undefined

        if (themeList !== undefined) {
            await supabase.from('contact_themes').delete().eq('contact_id', id)
            if (themeList.length > 0) {
                await supabase.from('contact_themes').insert(
                    themeList.map(tid => ({ contact_id: id, theme_id: tid }))
                )
            }
        }

        if (tagList !== undefined) {
            await supabase.from('contact_tags').delete().eq('contact_id', id)
            if (tagList.length > 0) {
                await supabase.from('contact_tags').insert(
                    tagList.map(tid => ({ contact_id: id, tag_id: tid }))
                )
            }
        }

        await fetchContacts()
    }

    const deleteContact = async (id) => {
        await supabase.from('contacts').delete().eq('id', id)
        await fetchContacts()
    }

    const deleteMany = async (ids) => {
        await supabase.from('contacts').delete().in('id', ids)
        await fetchContacts()
    }

    const importContacts = async ({ rows, tag_ids = [], theme_ids = [], origin = '' }) => {
        const user_id = await getCurrentUserId()
        const { data: created, error } = await supabase
            .from('contacts')
            .insert(rows.map(r => ({ ...r, source: 'import', origin: origin || null, user_id, status: 'active' })))
            .select('id')

        if (error) { console.error('importContacts error:', error); return 0 }

        if (theme_ids.length > 0 && created?.length > 0) {
            await supabase.from('contact_themes').insert(
                created.flatMap(c => theme_ids.map(tid => ({ contact_id: c.id, theme_id: tid })))
            )
        }

        if (tag_ids.length > 0 && created?.length > 0) {
            await supabase.from('contact_tags').insert(
                created.flatMap(c => tag_ids.map(tid => ({ contact_id: c.id, tag_id: tid })))
            )
        }

        await supabase.from('activity_logs').insert({
            user_id,
            action: 'contacts_imported',
            entity_type: 'contact',
            details: { count: created?.length ?? 0, origin },
        })

        await fetchContacts()
        return created?.length ?? 0
    }

    return { contacts, loading, total, createContact, updateContact, deleteContact, deleteMany, importContacts, refetch: fetchContacts }
}
