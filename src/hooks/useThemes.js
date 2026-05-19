import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useThemes() {
    const [themes, setThemes] = useState([])
    const [loading, setLoading] = useState(true)

    const fetch = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('themes_with_count')
            .select('*')
            .order('created_at', { ascending: false })
        if (!error) setThemes(data ?? [])
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    const createTheme = async (payload) => {
        const user_id = await getCurrentUserId()
        const { data, error } = await supabase
            .from('themes')
            .insert({ ...payload, user_id })
            .select()
            .single()
        if (!error) await fetch()
        return data
    }

    const updateTheme = async (id, payload) => {
        await supabase
            .from('themes')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)
        await fetch()
    }

    const deleteTheme = async (id) => {
        await supabase.from('themes').delete().eq('id', id)
        await fetch()
    }

    return { themes, loading, createTheme, updateTheme, deleteTheme, refetch: fetch }
}
