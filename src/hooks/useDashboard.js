import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const now = new Date()
            const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

            const [
                { count: totalContacts },
                { count: activeContacts },
                { count: activeAlarms },
                { count: sentThisMonth },
                { data: themesData },
                { data: nextAlarmsData },
                { data: activityData },
            ] = await Promise.all([
                supabase.from('contacts').select('*', { count: 'exact', head: true }),
                supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
                supabase.from('alarms').select('*', { count: 'exact', head: true }).eq('status', 'active'),
                supabase.from('send_logs').select('*', { count: 'exact', head: true }).gte('sent_at', firstOfMonth),
                supabase.from('themes_with_count').select('name, contact_count, color').order('contact_count', { ascending: false }).limit(8),
                supabase.from('alarms').select('*').eq('status', 'active').not('next_run', 'is', null).order('next_run').limit(5),
                supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(10),
            ])

            setData({
                stats: {
                    totalContacts: totalContacts ?? 0,
                    activeContacts: activeContacts ?? 0,
                    sentThisMonth: sentThisMonth ?? 0,
                    activeAlarms: activeAlarms ?? 0,
                },
                contactsByTheme: themesData ?? [],
                nextAlarms: nextAlarmsData ?? [],
                activityLogs: activityData ?? [],
            })
            setLoading(false)
        }
        load()
    }, [])

    return { data, loading }
}
