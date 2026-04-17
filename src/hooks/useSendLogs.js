import { useState, useCallback, useEffect } from 'react'
import { mockSendLogs as initial } from '../data/mockData'

let store = [...initial]

export function useSendLogs(filters = {}) {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const fetch = useCallback(async () => {
        setLoading(true)
        await delay(200)

        let data = [...store].sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))

        if (filters.status) data = data.filter(l => l.status === filters.status)
        if (filters.alarm_id) data = data.filter(l => l.alarm_id === filters.alarm_id)
        if (filters.search) {
            const q = filters.search.toLowerCase()
            data = data.filter(l => l.contact_name?.toLowerCase().includes(q) || l.phone.includes(q))
        }

        setTotal(data.length)
        setLogs(data)
        setLoading(false)
    }, [filters.status, filters.alarm_id, filters.search])

    useEffect(() => { fetch() }, [fetch])

    const addLog = async (payload) => {
        const item = { id: uid(), user_id: 'user-001', status: 'simulated', sent_at: new Date().toISOString(), ...payload }
        store = [item, ...store]
    }

    return { logs, loading, total, addLog, refetch: fetch }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
function uid() { return 'sl-' + Math.random().toString(36).slice(2, 9) }
