import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useMunicipalities() {
    const [municipalities, setMunicipalities] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMunicipalities = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('municipalities')
            .select('*')
            .order('nome', { ascending: true })
        if (!error) setMunicipalities(data ?? [])
        setLoading(false)
    }, [])

    useEffect(() => { fetchMunicipalities() }, [fetchMunicipalities])

    const createMunicipality = async (payload) => {
        const user_id = await getCurrentUserId()
        const { data, error } = await supabase
            .from('municipalities')
            .insert({ ...payload, user_id })
            .select()
            .single()
        if (!error) await fetchMunicipalities()
        return data
    }

    const updateMunicipality = async (id, payload) => {
        await supabase
            .from('municipalities')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)
        await fetchMunicipalities()
    }

    const deleteMunicipality = async (id) => {
        await supabase.from('municipalities').delete().eq('id', id)
        await fetchMunicipalities()
    }

    return { municipalities, loading, createMunicipality, updateMunicipality, deleteMunicipality, refetch: fetchMunicipalities }
}
