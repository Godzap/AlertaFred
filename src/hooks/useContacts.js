import { useState, useCallback, useEffect } from 'react'
import { mockContacts as initial } from '../data/mockData'

let store = [...initial]

export function useContacts(filters = {}) {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    const fetchContacts = useCallback(async () => {
        setLoading(true)
        await delay(200)

        let data = [...store]

        if (filters.status) data = data.filter(c => c.status === filters.status)
        if (filters.theme_id) data = data.filter(c => c.themes?.some(t => t.id === filters.theme_id))
        if (filters.tag_id) data = data.filter(c => c.tags?.some(t => t.id === filters.tag_id))
        if (filters.search) {
            const q = filters.search.toLowerCase()
            data = data.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q))
        }

        const total = data.length
        const page = filters.page || 1
        const perPage = filters.perPage || 20
        const from = (page - 1) * perPage
        data = data.slice(from, from + perPage)

        setTotal(total)
        setContacts(data)
        setLoading(false)
    }, [filters.status, filters.theme_id, filters.tag_id, filters.search, filters.page, filters.perPage])

    useEffect(() => { fetchContacts() }, [fetchContacts])

    const createContact = async (payload) => {
        await delay(400)
        const item = {
            id: uid(), user_id: 'user-001', status: 'active', source: 'manual',
            themes: [], tags: [], notes: '', custom_fields: {},
            created_at: new Date().toISOString(), ...payload,
        }
        store = [item, ...store]
        await fetchContacts()
        return item
    }

    const updateContact = async (id, payload) => {
        await delay(400)
        store = store.map(c => c.id === id ? { ...c, ...payload } : c)
        await fetchContacts()
    }

    const deleteContact = async (id) => {
        await delay(300)
        store = store.filter(c => c.id !== id)
        await fetchContacts()
    }

    const deleteMany = async (ids) => {
        await delay(400)
        store = store.filter(c => !ids.includes(c.id))
        await fetchContacts()
    }

    return { contacts, loading, total, createContact, updateContact, deleteContact, deleteMany, refetch: fetchContacts }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
function uid() { return 'c-' + Math.random().toString(36).slice(2, 9) }
