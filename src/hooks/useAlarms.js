import { useState, useCallback, useEffect } from 'react'
import { supabase, getCurrentUserId } from '../lib/supabase'

export function useAlarms() {
    const [alarms, setAlarms] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAlarms = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('alarms')
            .select('*, message_templates(name), alarm_targets(*)')
            .order('created_at', { ascending: false })
        if (!error) {
            setAlarms((data ?? []).map(a => ({
                ...a,
                template: a.message_templates,
            })))
        }
        setLoading(false)
    }, [])

    useEffect(() => { fetchAlarms() }, [fetchAlarms])

    const createAlarm = async ({ targets = [], ...payload }) => {
        const user_id = await getCurrentUserId()
        const { data: alarm, error } = await supabase
            .from('alarms')
            .insert({ status: 'active', ...payload, user_id })
            .select()
            .single()
        if (error || !alarm) return null

        if (targets.length > 0) {
            await supabase.from('alarm_targets').insert(
                targets.map(t => ({ alarm_id: alarm.id, target_type: t.type, target_id: t.id }))
            )
        }

        await fetchAlarms()
        return alarm
    }

    const updateAlarm = async (id, { targets, ...payload }) => {
        await supabase
            .from('alarms')
            .update({ ...payload, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (targets !== undefined) {
            await supabase.from('alarm_targets').delete().eq('alarm_id', id)
            if (targets.length > 0) {
                await supabase.from('alarm_targets').insert(
                    targets.map(t => ({ alarm_id: id, target_type: t.type, target_id: t.id }))
                )
            }
        }

        await fetchAlarms()
    }

    const deleteAlarm = async (id) => {
        await supabase.from('alarms').delete().eq('id', id)
        await fetchAlarms()
    }

    const toggleStatus = async (id) => {
        const alarm = alarms.find(a => a.id === id)
        if (!alarm) return
        await updateAlarm(id, { status: alarm.status === 'active' ? 'paused' : 'active' })
    }

    return { alarms, loading, createAlarm, updateAlarm, deleteAlarm, toggleStatus, refetch: fetchAlarms }
}
