import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const BUCKET = 'anniversary-materials'

export function useAnniversaryMaterials(pessoaId) {
    const [materials, setMaterials] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMaterials = useCallback(async () => {
        if (!pessoaId) { setMaterials([]); setLoading(false); return }
        setLoading(true)
        const { data, error } = await supabase
            .from('anniversary_materials')
            .select('*')
            .eq('pessoa_id', pessoaId)
            .order('created_at', { ascending: false })
        if (!error) {
            setMaterials((data ?? []).map(m => ({
                ...m,
                url: supabase.storage.from(BUCKET).getPublicUrl(m.storage_path).data.publicUrl,
            })))
        }
        setLoading(false)
    }, [pessoaId])

    useEffect(() => { fetchMaterials() }, [fetchMaterials])

    const uploadMaterial = async ({ file, texto }) => {
        const tipo = file.type.startsWith('video') ? 'video' : 'foto'
        const ext = file.name.split('.').pop()
        const path = `${pessoaId}/${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError

        const { data, error } = await supabase
            .from('anniversary_materials')
            .insert({ pessoa_id: pessoaId, tipo, storage_path: path, texto: texto || null })
            .select()
            .single()
        if (error) throw error

        await fetchMaterials()
        return data
    }

    const toggleEnviado = async (id, enviado) => {
        await supabase.from('anniversary_materials').update({ enviado }).eq('id', id)
        await fetchMaterials()
    }

    const deleteMaterial = async (id, storage_path) => {
        await supabase.storage.from(BUCKET).remove([storage_path])
        await supabase.from('anniversary_materials').delete().eq('id', id)
        await fetchMaterials()
    }

    return { materials, loading, uploadMaterial, toggleEnviado, deleteMaterial, refetch: fetchMaterials }
}
