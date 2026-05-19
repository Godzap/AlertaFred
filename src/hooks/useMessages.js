import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useMessages() {
    const [templates, setTemplates] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTemplates = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('message_templates')
            .select('*')
            .order('created_at', { ascending: false })
        if (!error) setTemplates(data ?? [])
        setLoading(false)
    }, [])

    useEffect(() => { fetchTemplates() }, [fetchTemplates])

    const createTemplate = async (payload) => {
        const user_id = await getCurrentUserId()
        const { data, error } = await supabase
            .from('message_templates')
            .insert({ ...payload, user_id })
            .select()
            .single()
        if (!error) await fetchTemplates()
        return data
    }

    const updateTemplate = async (id, payload) => {
        await supabase
            .from('message_templates')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)
        await fetchTemplates()
    }

    const deleteTemplate = async (id) => {
        await supabase.from('message_templates').delete().eq('id', id)
        await fetchTemplates()
    }

    return { templates, loading, createTemplate, updateTemplate, deleteTemplate, refetch: fetchTemplates }
}
