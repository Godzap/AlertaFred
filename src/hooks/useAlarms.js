import { useState, useCallback, useEffect } from 'react'
import { mockAlarms as initial } from '../data/mockData'

let store = [...initial]

export function useAlarms() {
    const [alarms, setAlarms] = useState([])
    const [loading, setLoading] = useState(true)

    const fetch = useCallback(async () => {
        setLoading(true)
        await delay(200)
        setAlarms([...store])
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    const createAlarm = async (payload) => {
        await delay(400)
        const item = { id: uid(), user_id: 'user-001', status: 'active', last_run: null, created_at: new Date().toISOString(), ...payload }
        store = [item, ...store]
        await fetch()
        return item
    }

    const updateAlarm = async (id, payload) => {
        await delay(400)
        store = store.map(a => a.id === id ? { ...a, ...payload } : a)
        await fetch()
    }

    const deleteAlarm = async (id) => {
        await delay(300)
        store = store.filter(a => a.id !== id)
        await fetch()
    }

    const toggleStatus = async (id) => {
        const alarm = store.find(a => a.id === id)
        if (!alarm) return
        const newStatus = alarm.status === 'active' ? 'paused' : 'active'
        await updateAlarm(id, { status: newStatus })
    }

    return { alarms, loading, createAlarm, updateAlarm, deleteAlarm, toggleStatus, refetch: fetch }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
function uid() { return 'al-' + Math.random().toString(36).slice(2, 9) }
