import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, GripVertical, ArrowLeft } from 'lucide-react'
import { useForms } from '../hooks/useForms'
import { useThemes } from '../hooks/useThemes'
import { useToast } from '../components/ui/Toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import Toggle from '../components/ui/Toggle'

const FIELD_TYPES = [
    { value: 'text', label: 'Texto' },
    { value: 'phone', label: 'Telefone' },
    { value: 'email', label: 'E-mail' },
    { value: 'number', label: 'Número' },
    { value: 'select', label: 'Seleção única' },
    { value: 'multiselect', label: 'Seleção múltipla' },
    { value: 'date', label: 'Data' },
    { value: 'textarea', label: 'Área de texto' },
]

const emptyField = () => ({ id: Math.random().toString(36).slice(2), name: '', label: '', type: 'text', required: false, options: [] })

function FieldEditor({ field, onChange, onDelete, index }) {
    const set = (k) => (v) => onChange({ ...field, [k]: typeof v === 'string' ? v : v })
    const setE = (k) => (e) => set(k)(e.target.value)

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 shadow-card">
            <div className="text-gray-300 mt-1 cursor-grab shrink-0"><GripVertical size={16} /></div>
            <div className="flex-1 grid grid-cols-2 gap-3">
                <Input label="Label" value={field.label} onChange={e => { setE('label')(e); set('name')(e.target.value.toLowerCase().replace(/\s+/g, '_')) }} placeholder="Ex: Nome completo" />
                <Select label="Tipo" value={field.type} onChange={setE('type')} options={FIELD_TYPES} placeholder={null} />
                {['select', 'multiselect'].includes(field.type) && (
                    <div className="col-span-2">
                        <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                            Opções (uma por linha)
                        </label>
                        <textarea
                            value={field.options?.join('\n') || ''}
                            onChange={e => set('options')(e.target.value.split('\n').filter(Boolean))}
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 resize-none"
                        />
                    </div>
                )}
                <div className="col-span-2 flex items-center justify-between">
                    <Toggle checked={field.required} onChange={v => set('required')(v)} label="Campo obrigatório" size="sm" />
                    <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

function FormPreview({ form }) {
    const fieldInput = (f) => {
        if (f.type === 'textarea') return <textarea rows={2} placeholder={f.label} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-200" />
        if (['select', 'multiselect'].includes(f.type)) return (
            <select className="w-full h-8 rounded-lg border border-gray-200 px-2 text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-brand-200">
                <option value="">Selecione...</option>
                {f.options?.map(o => <option key={o}>{o}</option>)}
            </select>
        )
        return <input type={f.type === 'phone' ? 'tel' : f.type} placeholder={f.type === 'phone' ? '+55 11 99999-9999' : f.label} className="w-full h-8 rounded-lg border border-gray-200 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-200" />
    }

    return (
        <div className="flex justify-center">
            {/* Phone mockup */}
            <div className="w-64 bg-gray-900 rounded-[32px] p-3 shadow-card-lg">
                <div className="bg-white rounded-[24px] overflow-hidden">
                    {/* Status bar */}
                    <div className="bg-brand-600 px-4 py-2 flex items-center justify-between">
                        <span className="text-white text-xs font-bold">ZapCRM</span>
                    </div>
                    <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-0.5">{form.title || 'Título do formulário'}</h3>
                        {form.description && <p className="text-xs text-gray-500 mb-3">{form.description}</p>}
                        <div className="flex flex-col gap-2.5">
                            {form.fields.map(f => (
                                <div key={f.id}>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">
                                        {f.label || 'Campo'} {f.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {fieldInput(f)}
                                </div>
                            ))}
                        </div>
                        {form.fields.length > 0 && (
                            <button className="w-full mt-4 h-9 rounded-xl bg-brand-600 text-white text-xs font-semibold">
                                Enviar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function FormBuilderPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { forms, createForm, updateForm } = useForms()
    const { themes } = useThemes()
    const { toast } = useToast()
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        title: '',
        slug: '',
        description: '',
        fields: [],
        auto_theme_id: '',
        confirmation_message: 'Obrigado pelo cadastro!',
    })

    useEffect(() => {
        if (id) {
            const existing = forms.find(f => f.id === id)
            if (existing) setForm({ ...existing, auto_theme_id: existing.auto_theme_id || '' })
        }
    }, [id, forms])

    const setF = (k) => (v) => setForm(f => ({ ...f, [k]: v }))
    const setFE = (k) => (e) => setF(k)(e.target.value)

    const addField = () => setForm(f => ({ ...f, fields: [...f.fields, emptyField()] }))
    const updateField = (i, v) => setForm(f => ({ ...f, fields: f.fields.map((fl, idx) => idx === i ? v : fl) }))
    const deleteField = (i) => setForm(f => ({ ...f, fields: f.fields.filter((_, idx) => idx !== i) }))

    const autoSlug = (title) => title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (id) {
                await updateForm(id, form)
                toast('Formulário atualizado', 'success')
            } else {
                await createForm({ ...form, slug: form.slug || autoSlug(form.title) })
                toast('Formulário criado', 'success')
            }
            navigate('/forms')
        } catch (err) {
            toast(err.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="page-enter">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate('/forms')} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
                        {id ? 'Editar formulário' : 'Novo formulário'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div className="grid grid-cols-3 gap-6">
                    {/* Left: config */}
                    <div className="col-span-2 flex flex-col gap-5">
                        {/* Basic info */}
                        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Configurações</h3>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="Título"
                                    value={form.title}
                                    onChange={e => { setFE('title')(e); if (!id) setF('slug')(autoSlug(e.target.value)) }}
                                    placeholder="Ex: Cadastro de evento"
                                    required
                                />
                                <Input
                                    label="Slug (URL)"
                                    value={form.slug}
                                    onChange={setFE('slug')}
                                    placeholder="cadastro-evento"
                                />
                                <Textarea
                                    label="Descrição"
                                    value={form.description}
                                    onChange={setFE('description')}
                                    placeholder="Descrição exibida no formulário público..."
                                    rows={2}
                                />
                                <Select
                                    label="Tema automático"
                                    value={form.auto_theme_id}
                                    onChange={setFE('auto_theme_id')}
                                    placeholder="Nenhum"
                                    options={themes.map(t => ({ value: t.id, label: t.name }))}
                                />
                                <Input
                                    label="Mensagem de confirmação"
                                    value={form.confirmation_message}
                                    onChange={setFE('confirmation_message')}
                                    placeholder="Obrigado pelo cadastro!"
                                />
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Campos</h3>
                                <Button type="button" variant="secondary" size="sm" icon={<Plus size={13} />} onClick={addField}>
                                    Adicionar campo
                                </Button>
                            </div>
                            <div className="flex flex-col gap-3">
                                {form.fields.length === 0 && (
                                    <div className="text-center py-8 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                        Nenhum campo adicionado. Clique em "Adicionar campo".
                                    </div>
                                )}
                                {form.fields.map((f, i) => (
                                    <FieldEditor key={f.id} field={f} index={i} onChange={v => updateField(i, v)} onDelete={() => deleteField(i)} />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button type="button" variant="ghost" onClick={() => navigate('/forms')}>Cancelar</Button>
                            <Button type="submit" loading={saving}>Salvar formulário</Button>
                        </div>
                    </div>

                    {/* Right: preview */}
                    <div className="sticky top-6 self-start">
                        <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Preview</h3>
                            <FormPreview form={form} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
