import { useState, useCallback } from 'react'
import { mockTags as initial } from '../data/mockData'

let store = [...initial]

export function useTags() {
    const [tags, setTags] = useState([...store])
    const [loading] = useState(false)

    const refresh = useCallback(() => setTags([...store]), [])

    const createTag = async (payload) => {
        await delay(300)
        const item = { id: uid(), user_id: 'user-001', contact_count: 0, ...payload }
        store = [item, ...store]
        refresh()
        return item
    }

    const updateTag = async (id, payload) => {
        await delay(300)
        store = store.map(t => t.id === id ? { ...t, ...payload } : t)
        refresh()
    }

    const deleteTag = async (id) => {
        await delay(300)
        store = store.filter(t => t.id !== id)
        refresh()
    }

    return { tags, loading, createTag, updateTag, deleteTag }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
function uid() { return 'tg-' + Math.random().toString(36).slice(2, 9) }
