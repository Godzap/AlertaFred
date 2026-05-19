import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useContacts(filters = {}) {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const fetchContacts = useCallback(async () => {
        setLoading(true)

        // filter by theme_id / tag_id via junction tables first
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

        // fetch contacts
        let query = supabase
            .from('contacts')
<<<<<<< HEAD
            .select('*')
            .order('created_at', { ascending: false })

        if (filters.status) query = query.eq('status', filters.status)
        if (filters.search) {
            const q = filters.search
            query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
=======
            .select('*', { count: 'exact' })

        if (filters.status) query = query.eq('status', filters.status)
        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
>>>>>>> 5010542ceb4c914e8ee4f94d19417ed4f29e2b0e
        }
        if (allowedIds) query = query.in('id', allowedIds)

        const page = filters.page || 1
        const perPage = filters.perPage || 20
<<<<<<< HEAD
        query = query.range((page - 1) * perPage, page * perPage - 1)

        const { data: contactsData, error } = await query

        if (error) {
            console.error('useContacts fetch error:', error)
=======
        const from = (page - 1) * perPage
        query = query.range(from, from + perPage - 1).order('created_at', { ascending: false })

        const { data: contactsData, count, error } = await query

        if (error || !contactsData) {
>>>>>>> 5010542ceb4c914e8ee4f94d19417ed4f29e2b0e
            setLoading(false)
            return
        }

        // fetch themes and tags for these contacts separately
        const ids = contactsData.map(c => c.id)
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

        setContacts(contactsData.map(c => ({
            ...c,
            themes: themesMap[c.id] ?? [],
            tags: tagsMap[c.id] ?? [],
        })))
<<<<<<< HEAD
        setTotal(contactsData.length)
=======
        setTotal(count ?? 0)
>>>>>>> 5010542ceb4c914e8ee4f94d19417ed4f29e2b0e
        setLoading(false)
    }, [filters.status, filters.theme_id, filters.tag_id, filters.search, filters.page, filters.perPage])

    useEffect(() => { fetchContacts() }, [fetchContacts])

    const createContact = async ({ themes = [], tags = [], ...payload }) => {
        const user_id = await getCurrentUserId()
        const { data: contact, error } = await supabase
            .from('contacts')
            .insert({ status: 'active', source: 'manual', ...payload, user_id })
            .select()
            .single()
        if (error || !contact) return null

        if (themes.length > 0) {
            await supabase.from('contact_themes').insert(
                themes.map(t => ({ contact_id: contact.id, theme_id: t.id ?? t }))
            )
        }
        if (tags.length > 0) {
            await supabase.from('contact_tags').insert(
                tags.map(t => ({ contact_id: contact.id, tag_id: t.id ?? t }))
            )
        }

        await fetchContacts()
        return contact
    }

    const updateContact = async (id, { themes, tags, ...payload }) => {
        if (Object.keys(payload).length > 0) {
            await supabase
                .from('contacts')
                .update({ ...payload, updated_at: new Date().toISOString() })
                .eq('id', id)
        }

        if (themes !== undefined) {
            await supabase.from('contact_themes').delete().eq('contact_id', id)
            if (themes.length > 0) {
                await supabase.from('contact_themes').insert(
                    themes.map(t => ({ contact_id: id, theme_id: t.id ?? t }))
                )
            }
        }

        if (tags !== undefined) {
            await supabase.from('contact_tags').delete().eq('contact_id', id)
            if (tags.length > 0) {
                await supabase.from('contact_tags').insert(
                    tags.map(t => ({ contact_id: id, tag_id: t.id ?? t }))
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

    return { contacts, loading, total, createContact, updateContact, deleteContact, deleteMany, refetch: fetchContacts }
}
