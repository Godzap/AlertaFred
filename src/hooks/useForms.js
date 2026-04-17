import { useState, useCallback, useEffect } from 'react'
import { mockForms as initial } from '../data/mockData'

let store = [...initial]

export function useForms() {
    const [forms, setForms] = useState([])
    const [loading, setLoading] = useState(true)

    const fetch = useCallback(async () => {
        setLoading(true)
        await delay(200)
        setForms([...store])
        setLoading(false)
    }, [])

    useEffect(() => { fetch() }, [fetch])

    const createForm = async (payload) => {
        await delay(400)
        const item = { id: uid(), user_id: 'user-001', active: true, submissions: 0, created_at: new Date().toISOString(), ...payload }
        store = [item, ...store]
        await fetch()
        return item
    }

    const updateForm = async (id, payload) => {
        await delay(400)
        store = store.map(f => f.id === id ? { ...f, ...payload } : f)
        await fetch()
    }

    const deleteForm = async (id) => {
        await delay(300)
        store = store.filter(f => f.id !== id)
        await fetch()
    }

    const getFormBySlug = async (slug) => {
        await delay(200)
        return store.find(f => f.slug === slug && f.active) || null
    }

    return { forms, loading, createForm, updateForm, deleteForm, getFormBySlug, refetch: fetch }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
function uid() { return 'frm-' + Math.random().toString(36).slice(2, 9) }
