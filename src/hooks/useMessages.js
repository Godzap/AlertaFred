import { useState, useCallback, useEffect } from 'react'
import { mockTemplates as initial } from '../data/mockData'

let store = [...initial]

export function useMessages() {
    const [templates, setTemplates] = useState([])
    const [loading, setLoading] = useState(true)

    const fetch = useCallback(async () => {
        setLoading(true)
        await delay(200)
        setTemplates([...store])
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    const createTemplate = async (payload) => {
        await delay(400)
        const item = { id: uid(), user_id: 'user-001', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...payload }
        store = [item, ...store]
        await fetch()
        return item
    }

    const updateTemplate = async (id, payload) => {
        await delay(400)
        store = store.map(t => t.id === id ? { ...t, ...payload, updated_at: new Date().toISOString() } : t)
        await fetch()
    }

    const deleteTemplate = async (id) => {
        await delay(300)
        store = store.filter(t => t.id !== id)
        await fetch()
    }

    return { templates, loading, createTemplate, updateTemplate, deleteTemplate, refetch: fetch }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
function uid() { return 'tpl-' + Math.random().toString(36).slice(2, 9) }
