import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users } from 'lucide-react'
import { useAlarms } from '../hooks/useAlarms'
import { useMessages } from '../hooks/useMessages'
import { useThemes } from '../hooks/useThemes'
import { useTags } from '../hooks/useTags'
import { useContacts } from '../hooks/useContacts'
import { useToast } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const EMPTY = {
    name: '', message_template_id: '',
    target_type: 'all', target_value: [],
    schedule_type: 'daily', schedule_times: ['09:00'],
    schedule_days_of_week: [1, 2, 3, 4, 5],
    schedule_day_of_month: 1,
    schedule_date: '',
    timezone: 'America/Sao_Paulo',
}

function scheduleSummary(form, recipientCount) {
    const typeMap = { once: 'uma vez', daily: 'todo dia', multi_daily: 'várias vezes ao dia', weekly: 'semanalmente', monthly: 'mensalmente' }
    const times = form.schedule_times?.join(', ') || ''

    if (form.schedule_type === 'weekly' && form.schedule_days_of_week?.length) {
        const days = form.schedule_days_of_week.map(d => DAYS[d]).join(', ')
        return `Enviada para ${recipientCount} contato${recipientCount !== 1 ? 's' : ''} toda ${days} às ${times} (Horário de Brasília)`
    }
    if (form.schedule_type === 'monthly') {
        return `Enviada para ${recipientCount} contato${recipientCount !== 1 ? 's' : ''} todo dia ${form.schedule_day_of_month} do mês às ${times} (Horário de Brasília)`
    }
    if (form.schedule_type === 'once') {
        return `Enviada para ${recipientCount} contato${recipientCount !== 1 ? 's' : ''} uma vez em ${form.schedule_date || '(data não definida)'} às ${times}`
    }
    return `Enviada para ${recipientCount} contato${recipientCount !== 1 ? 's' : ''} ${typeMap[form.schedule_type] || ''} às ${times} (Horário de Brasília)`
}

export default function AlarmEditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { alarms, createAlarm, updateAlarm } = useAlarms()
    const { templates } = useMessages()
    const { themes } = useThemes()
    const { tags } = useTags()
    const { contacts } = useContacts({ status: 'active' })
    const { toast } = useToast()
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (id) {
            const a = alarms.find(a => a.id === id)
            if (a) setForm({ ...a, schedule_days_of_week: a.schedule_days_of_week || [1,2,3,4,5], schedule_day_of_month: a.schedule_day_of_month || 1 })
        }
    }, [id, alarms])

    const setF = (k) => (v) => setForm(f => ({ ...f, [k]: v }))
    const setFE = (k) => (e) => setF(k)(e.target.value)

    const recipientCount = (() => {
        if (form.target_type === 'all') return contacts.length
        if (form.target_type === 'theme') return contacts.filter(c => c.themes?.some(t => form.target_value.includes(t.id))).length
        if (form.target_type === 'tag') return contacts.filter(c => c.tags?.some(t => form.target_value.includes(t.id))).length
        return form.target_value.length
    })()

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                ...form,
                template: templates.find(t => t.id === form.message_template_id),
                target_label: form.target_type === 'all' ? 'Todos os contatos' :
                    form.target_type === 'theme' ? `Tema: ${themes.find(t => form.target_value[0] === t.id)?.name || ''}` :
                    form.target_type === 'tag' ? `Tag: ${tags.find(t => form.target_value[0] === t.id)?.name || ''}` : 'Manual',
                schedule_label: scheduleSummary(form, recipientCount),
                recipient_count: recipientCount,
                next_run: new Date(Date.now() + 86400000).toISOString(),
            }
            if (id) { await updateAlarm(id, payload); toast('Alarme atualizado', 'success') }
            else { await createAlarm(payload); toast('Alarme criado', 'success') }
            navigate('/alarms')
        } catch (err) { toast(err.message, 'error') }
        finally { setSaving(false) }
    }

    const toggleDay = (d) => {
        const days = form.schedule_days_of_week || []
        setF('schedule_days_of_week')(days.includes(d) ? days.filter(x => x !== d) : [...days, d].sort())
    }

    const addTime = () => setForm(f => ({ ...f, schedule_times: [...(f.schedule_times || []), '12:00'] }))
    const removeTime = (i) => setForm(f => ({ ...f, schedule_times: f.schedule_times.filter((_, idx) => idx !== i) }))
    const updateTime = (i, v) => setForm(f => ({ ...f, schedule_times: f.schedule_times.map((t, idx) => idx === i ? v : t) }))

    return (
        <div className="page-enter max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/alarms')} className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft size={18} /></button>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
                    {id ? 'Editar alarme' : 'Novo alarme'}
                </h1>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
                {/* Basic */}
                <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-gray-700" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Informações</h3>
                    <Input label="Nome do alarme" value={form.name} onChange={setFE('name')} placeholder="Ex: Boas-vindas automático" required />
                    <Select
                        label="Template de mensagem"
                        value={form.message_template_id}
                        onChange={setFE('message_template_id')}
                        options={templates.map(t => ({ value: t.id, label: t.name }))}
                        placeholder="Selecione um template..."
                    />
                </div>

                {/* Target */}
                <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-gray-700" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Destinatários</h3>
                    <div className="flex flex-col gap-2">
                        {[
                            { value: 'all', label: 'Todos os contatos ativos' },
                            { value: 'theme', label: 'Por tema' },
                            { value: 'tag', label: 'Por tag' },
                        ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-3 cursor-pointer py-1">
                                <input type="radio" name="target_type" value={opt.value} checked={form.target_type === opt.value}
                                    onChange={() => setForm(f => ({ ...f, target_type: opt.value, target_value: [] }))}
                                    className="text-brand-600 focus:ring-brand-200" />
                                <span className="text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>

                    {form.target_type === 'theme' && (
                        <div className="flex flex-wrap gap-2">
                            {themes.map(t => (
                                <button key={t.id} type="button"
                                    onClick={() => setF('target_value')(form.target_value.includes(t.id) ? form.target_value.filter(x => x !== t.id) : [...form.target_value, t.id])}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                                    style={form.target_value.includes(t.id) ? { backgroundColor: t.color, borderColor: t.color, color: '#fff' } : { borderColor: '#dde2eb', color: '#4a5568' }}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {form.target_type === 'tag' && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map(t => (
                                <button key={t.id} type="button"
                                    onClick={() => setF('target_value')(form.target_value.includes(t.id) ? form.target_value.filter(x => x !== t.id) : [...form.target_value, t.id])}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                                    style={form.target_value.includes(t.id) ? { backgroundColor: t.color, borderColor: t.color, color: '#fff' } : { borderColor: '#dde2eb', color: '#4a5568' }}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl px-4 py-2.5">
                        <Users size={14} className="text-brand-500" />
                        <span className="text-sm text-brand-700 font-medium">{recipientCount} contato{recipientCount !== 1 ? 's' : ''} selecionado{recipientCount !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Schedule */}
                <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-gray-700" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Agendamento</h3>
                    <Select
                        label="Tipo de recorrência"
                        value={form.schedule_type}
                        onChange={setFE('schedule_type')}
                        placeholder={null}
                        options={[
                            { value: 'once', label: 'Uma vez' },
                            { value: 'daily', label: 'Diário' },
                            { value: 'multi_daily', label: 'Várias vezes ao dia' },
                            { value: 'weekly', label: 'Semanal' },
                            { value: 'monthly', label: 'Mensal' },
                        ]}
                    />

                    {/* Times */}
                    <div>
                        <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                            Horário{form.schedule_type === 'multi_daily' ? 's' : ''}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {form.schedule_times?.map((t, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <input type="time" value={t} onChange={e => updateTime(i, e.target.value)}
                                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200" />
                                    {form.schedule_times.length > 1 && (
                                        <button type="button" onClick={() => removeTime(i)} className="text-gray-400 hover:text-red-500 transition-colors text-xs px-1">✕</button>
                                    )}
                                </div>
                            ))}
                            {form.schedule_type === 'multi_daily' && (
                                <button type="button" onClick={addTime} className="h-9 px-3 rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-brand-300 hover:text-brand-600 transition-colors">
                                    + Horário
                                </button>
                            )}
                        </div>
                    </div>

                    {form.schedule_type === 'weekly' && (
                        <div>
                            <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                                Dias da semana
                            </label>
                            <div className="flex gap-2">
                                {DAYS.map((d, i) => (
                                    <button key={i} type="button" onClick={() => toggleDay(i)}
                                        className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all ${(form.schedule_days_of_week || []).includes(i) ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {form.schedule_type === 'monthly' && (
                        <div className="w-32">
                            <Input label="Dia do mês" type="number" min={1} max={28} value={form.schedule_day_of_month} onChange={e => setF('schedule_day_of_month')(Number(e.target.value))} />
                        </div>
                    )}

                    {form.schedule_type === 'once' && (
                        <div className="w-48">
                            <Input label="Data" type="date" value={form.schedule_date} onChange={setFE('schedule_date')} />
                        </div>
                    )}

                    {/* Summary */}
                    {form.name && form.message_template_id && (
                        <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 text-sm text-brand-700">
                            {scheduleSummary(form, recipientCount)}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 justify-end">
                    <Button type="button" variant="ghost" onClick={() => navigate('/alarms')}>Cancelar</Button>
                    <Button type="submit" loading={saving}>Salvar alarme</Button>
                </div>
            </form>
        </div>
    )
}
