import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useForms() {
    const [forms, setForms] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchForms = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('forms')
            .select('*, form_fields(*)')
            .order('created_at', { ascending: false })
        if (!error) {
            setForms((data ?? []).map(f => ({
                ...f,
                fields: (f.form_fields ?? []).sort((a, b) => a.position - b.position),
            })))
        }
        setLoading(false)
    }, [])

    useEffect(() => { fetchForms() }, [fetchForms])

    const createForm = async ({ fields = [], ...payload }) => {
        const user_id = await getCurrentUserId()
        const { data: form, error } = await supabase
            .from('forms')
            .insert({ active: true, ...payload, user_id })
            .select()
            .single()
        if (error || !form) return null

        if (fields.length > 0) {
            await supabase.from('form_fields').insert(
                fields.map((f, i) => ({ ...f, form_id: form.id, position: i }))
            )
        }

        await fetchForms()
        return form
    }

    const updateForm = async (id, { fields, ...payload }) => {
        await supabase
            .from('forms')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (fields !== undefined) {
            await supabase.from('form_fields').delete().eq('form_id', id)
            if (fields.length > 0) {
                await supabase.from('form_fields').insert(
                    fields.map((f, i) => ({ ...f, form_id: id, position: i }))
                )
            }
        }

        await fetchForms()
    }

    const deleteForm = async (id) => {
        await supabase.from('forms').delete().eq('id', id)
        await fetchForms()
    }

    const getFormBySlug = async (slug) => {
        const { data } = await supabase
            .from('forms')
            .select('*, form_fields(*)')
            .eq('slug', slug)
            .eq('active', true)
            .single()
        if (!data) return null
        return {
            ...data,
            fields: (data.form_fields ?? []).sort((a, b) => a.position - b.position),
        }
    }

    return { forms, loading, createForm, updateForm, deleteForm, getFormBySlug, refetch: fetchForms }
}
