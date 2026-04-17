import { useState, useEffect } from 'react'
import { mockContacts, mockAlarms, mockSendLogs, mockActivityLogs, mockThemes } from '../data/mockData'

export function useDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            await new Promise(r => setTimeout(r, 300))

            const totalContacts = mockContacts.length
            const activeContacts = mockContacts.filter(c => c.status === 'active').length
            const activeAlarms = mockAlarms.filter(a => a.status === 'active').length
            const sentThisMonth = mockSendLogs.length

            const contactsByTheme = mockThemes.map(t => ({
                name: t.name,
                count: t.contact_count,
                color: t.color,
            })).sort((a, b) => b.count - a.count).slice(0, 8)

            const nextAlarms = [...mockAlarms]
                .filter(a => a.status === 'active' && a.next_run)
                .sort((a, b) => new Date(a.next_run) - new Date(b.next_run))
                .slice(0, 5)

            setData({
                stats: { totalContacts, activeContacts, sentThisMonth, activeAlarms },
                contactsByTheme,
                nextAlarms,
                activityLogs: mockActivityLogs,
            })
            setLoading(false)
        }
        load()
    }, [])

    return { data, loading }
}
