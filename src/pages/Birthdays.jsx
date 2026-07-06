import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Cake, Upload, Trash2, Send } from 'lucide-react'
import { useAnniversaryPeople } from '../hooks/useAnniversaryPeople'
import { useAnniversaryMaterials } from '../hooks/useAnniversaryMaterials'
import { useToast } from '../components/ui/Toast'
import { supabase } from '../lib/supabase'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Toggle from '../components/ui/Toggle'
import Textarea from '../components/ui/Textarea'
import SlideOver from '../components/ui/SlideOver'
import { getWeekDays, shiftWeek, matchesDay, isSameDay, WEEKDAY_LABELS } from '../lib/dateUtils'
import { format } from 'date-fns'

function nameColorClass(summary) {
    if (summary?.hasEnviado) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (summary?.hasMaterial) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-red-50 text-red-600 border-red-200'
}

export default function Birthdays() {
    const [refDate, setRefDate] = useState(new Date())
    const { people, loading } = useAnniversaryPeople()
    const [materialsSummary, setMaterialsSummary] = useState({})
    const [refreshKey, setRefreshKey] = useState(0)
    const [selectedPerson, setSelectedPerson] = useState(null)

    const weekDays = getWeekDays(refDate)

    useEffect(() => {
        const ids = people.map(p => p.id)
        if (ids.length === 0) { setMaterialsSummary({}); return }
        supabase
            .from('anniversary_materials')
            .select('pessoa_id, enviado')
            .in('pessoa_id', ids)
            .then(({ data }) => {
                const summary = {}
                ;(data ?? []).forEach(m => {
                    if (!summary[m.pessoa_id]) summary[m.pessoa_id] = { hasMaterial: false, hasEnviado: false }
                    summary[m.pessoa_id].hasMaterial = true
                    if (m.enviado) summary[m.pessoa_id].hasEnviado = true
                })
                setMaterialsSummary(summary)
            })
    }, [people, refreshKey])

    const columns = weekDays.map(day => ({
        date: day,
        label: WEEKDAY_LABELS[day.getDay()],
        people: people.filter(p => matchesDay(p.data_aniversario, day)),
    }))

    return (
        <div className="page-enter">
            <TopBar
                title="Aniversários"
                subtitle="Agenda semanal de aniversários"
                actions={
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-card px-2 py-1.5">
                        <button onClick={() => setRefDate(d => shiftWeek(d, -1))} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <ChevronLeft size={15} />
                        </button>
                        <span className="text-sm font-medium text-gray-700 px-1 whitespace-nowrap">
                            {format(weekDays[0], 'dd/MM')} – {format(weekDays[6], 'dd/MM')}
                        </span>
                        <button onClick={() => setRefDate(d => shiftWeek(d, 1))} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <ChevronRight size={15} />
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => setRefDate(new Date())}>Hoje</Button>
                    </div>
                }
            />

            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />Sem material</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Material pendente</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />Enviado</span>
            </div>

            {loading ? (
                <div className="grid grid-cols-7 gap-3">
                    {[...Array(7)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border border-gray-100" />)}
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-3">
                    {columns.map(col => {
                        const today = isSameDay(col.date, new Date())
                        return (
                            <div key={col.label} className={`bg-white rounded-2xl shadow-card border overflow-hidden flex flex-col ${today ? 'border-brand-300 bg-brand-50/30' : 'border-gray-100'}`}>
                                <div className="px-3 py-2.5 border-b border-gray-50">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{col.label}</p>
                                    <p className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{format(col.date, 'dd/MM')}</p>
                                </div>
                                <div className="p-2 flex flex-col gap-1.5 flex-1 min-h-[8rem]">
                                    {col.people.length === 0 ? (
                                        <p className="text-xs text-gray-300 text-center py-4">—</p>
                                    ) : col.people.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPerson(p)}
                                            className={`text-left text-xs font-medium px-2 py-1.5 rounded-lg border truncate transition-all hover:scale-[1.02] ${nameColorClass(materialsSummary[p.id])}`}
                                            title={p.nome}
                                        >
                                            {p.nome}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            <SlideOver
                open={!!selectedPerson}
                onClose={() => setSelectedPerson(null)}
                title={selectedPerson?.nome}
                subtitle={selectedPerson?.cargo}
            >
                {selectedPerson && (
                    <PersonPanel person={selectedPerson} onMaterialChange={() => setRefreshKey(k => k + 1)} />
                )}
            </SlideOver>
        </div>
    )
}

function PersonPanel({ person, onMaterialChange }) {
    const { materials, uploadMaterial, toggleEnviado, deleteMaterial } = useAnniversaryMaterials(person.id)
    const { toast } = useToast()
    const [texto, setTexto] = useState('')
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef(null)

    const handleUpload = async () => {
        if (!file) { toast('Selecione uma foto ou vídeo', 'error'); return }
        setUploading(true)
        try {
            await uploadMaterial({ file, texto })
            setTexto('')
            setFile(null)
            if (fileRef.current) fileRef.current.value = ''
            onMaterialChange()
            toast('Material enviado', 'success')
        } catch (err) {
            toast(err.message, 'error')
        } finally {
            setUploading(false)
        }
    }

    const handleToggle = async (id, enviado) => {
        await toggleEnviado(id, enviado)
        onMaterialChange()
    }

    const handleDelete = async (m) => {
        await deleteMaterial(m.id, m.storage_path)
        onMaterialChange()
    }

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-wrap gap-1.5">
                {(person.tags || []).map(t => <Badge key={t} color="#4a8ad4">{t}</Badge>)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Cargo</p>
                    <p className="text-gray-700">{person.cargo || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Município</p>
                    <p className="text-gray-700">{person.municipio?.nome || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Tipo de Aniversário</p>
                    <p className="text-gray-700">{person.tipo_aniversario || '—'}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Data</p>
                    <p className="text-gray-700 font-mono text-xs">{person.data_aniversario || '—'}</p>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                    <Cake size={15} className="text-brand-500" />
                    <h3 className="text-sm font-semibold text-gray-700">Material</h3>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                    <div
                        onClick={() => fileRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${file ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/40'}`}
                    >
                        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => setFile(e.target.files[0] || null)} />
                        {file ? (
                            <p className="text-xs font-medium text-emerald-700">{file.name}</p>
                        ) : (
                            <div className="flex flex-col items-center gap-1.5">
                                <Upload size={20} className="text-gray-300" />
                                <p className="text-xs text-gray-500">Selecionar foto ou vídeo</p>
                            </div>
                        )}
                    </div>
                    <Textarea value={texto} onChange={e => setTexto(e.target.value)} placeholder="Texto para acompanhar o material..." rows={3} />
                    <Button onClick={handleUpload} loading={uploading} icon={<Send size={14} />} size="sm">Enviar</Button>
                </div>

                <div className="flex flex-col gap-3">
                    {materials.map(m => (
                        <div key={m.id} className="border border-gray-100 rounded-xl overflow-hidden">
                            {m.tipo === 'foto' ? (
                                <img src={m.url} alt="" className="w-full max-h-48 object-cover" />
                            ) : (
                                <video src={m.url} controls className="w-full max-h-48" />
                            )}
                            <div className="p-3 flex flex-col gap-2">
                                {m.texto && <p className="text-xs text-gray-600">{m.texto}</p>}
                                <div className="flex items-center justify-between">
                                    <Toggle checked={m.enviado} onChange={(v) => handleToggle(m.id, v)} label="Enviado" size="sm" />
                                    <button onClick={() => handleDelete(m)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {materials.length === 0 && (
                        <p className="text-xs text-gray-300 text-center py-4">Nenhum material enviado ainda.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
