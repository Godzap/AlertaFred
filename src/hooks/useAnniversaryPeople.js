import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useAnniversaryPeople(filters = {}) {
    const [people, setPeople] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPeople = useCallback(async () => {
        setLoading(true)
        let query = supabase
            .from('anniversary_people')
            .select('*, municipalities(id, nome)')
            .order('nome', { ascending: true })

        if (filters.categoria) query = query.eq('categoria', filters.categoria)

        const { data, error } = await query
        if (!error) {
            setPeople((data ?? []).map(p => ({ ...p, municipio: p.municipalities ?? null })))
        }
        setLoading(false)
    }, [filters.categoria])

    useEffect(() => { fetchPeople() }, [fetchPeople])

    const createPerson = async (payload) => {
        const user_id = await getCurrentUserId()
        const { data, error } = await supabase
            .from('anniversary_people')
            .insert({ tags: [], ...payload, user_id })
            .select('*, municipalities(id, nome)')
            .single()
        if (!error) await fetchPeople()
        return data
    }

    const updatePerson = async (id, payload) => {
        await supabase
            .from('anniversary_people')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)
        await fetchPeople()
    }

    const deletePerson = async (id) => {
        await supabase.from('anniversary_people').delete().eq('id', id)
        await fetchPeople()
    }

    return { people, loading, createPerson, updatePerson, deletePerson, refetch: fetchPeople }
}
