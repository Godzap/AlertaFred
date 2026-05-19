import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useTags() {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)

    const fetch = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('tags_with_count')
            .select('*')
            .order('created_at', { ascending: false })
        if (!error) setTags(data ?? [])
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    const createTag = async (payload) => {
        const user_id = await getCurrentUserId()
        const { data, error } = await supabase
            .from('tags')
            .insert({ ...payload, user_id })
            .select()
            .single()
        if (!error) await fetch()
        return data
    }

    const updateTag = async (id, payload) => {
        await supabase
            .from('tags')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)
        await fetch()
    }

    const deleteTag = async (id) => {
        await supabase.from('tags').delete().eq('id', id)
        await fetch()
    }

    return { tags, loading, createTag, updateTag, deleteTag, refetch: fetch }
}
