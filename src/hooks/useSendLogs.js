import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useSendLogs(filters = {}) {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const fetchLogs = useCallback(async () => {
        setLoading(true)

        let query = supabase
            .from('send_logs')
            .select('*, contacts(name), alarms(name)', { count: 'exact' })
            .order('sent_at', { ascending: false })

        if (filters.status) query = query.eq('status', filters.status)
        if (filters.alarm_id) query = query.eq('alarm_id', filters.alarm_id)
        if (filters.search) {
            query = query.ilike('phone', `%${filters.search}%`)
        }

        const { data, count, error } = await query
        if (!error) {
            setLogs((data ?? []).map(l => ({
                ...l,
                contact_name: l.contacts?.name,
                alarm_name: l.alarms?.name,
            })))
            setTotal(count ?? 0)
        }
        setLoading(false)
    }, [filters.status, filters.alarm_id, filters.search])

    useEffect(() => { fetchLogs() }, [fetchLogs])

    const addLog = async (payload) => {
        const user_id = await getCurrentUserId()
        await supabase.from('send_logs').insert({ status: 'sent', ...payload, user_id })
    }

    return { logs, loading, total, addLog, refetch: fetchLogs }
}
