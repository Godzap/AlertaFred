import { useState } from 'react'
import { Plus, Pencil, Trash2, MessageSquare, Link, Image } from 'lucide-react'
import { useMessages } from '../hooks/useMessages'
import { useToast } from '../components/ui/Toast'
import { highlightVariables } from '../lib/templateEngine'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'

const EMPTY = { name: '', body: '', type: 'text', media_url: '' }

const typeIcon = { text: <MessageSquare size={13} />, text_link: <Link size={13} />, text_image: <Image size={13} /> }

function TemplateCard({ tpl, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 hover:shadow-card-md transition-all duration-200 p-5 flex flex-col gap-3 group">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {tpl.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge status={tpl.type}>{tpl.type}</Badge>
                        <span className="text-xs text-gray-400">{new Date(tpl.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => onEdit(tpl)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                        <Pencil size={13} />
                    </button>
                    <button onClick={() => onDelete(tpl)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
            <p
                className="text-sm text-gray-500 leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ __html: highlightVariables(tpl.body) }}
            />
        </div>
    )
}

function TemplateEditor({ form, setForm }) {
    const insertVar = (v) => setForm(f => ({ ...f, body: f.body + `{${v}}` }))

    return (
        <div className="grid grid-cols-3 gap-0 h-full">
            {/* Left: editor */}
            <div className="col-span-2 p-6 flex flex-col gap-4 border-r border-gray-100">
                <Input
                    label="Nome do template"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: Boas-vindas"
                    required
                />
                <Select
                    label="Tipo"
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    options={[
                        { value: 'text', label: 'Texto simples' },
                        { value: 'text_link', label: 'Texto + Link' },
                        { value: 'text_image', label: 'Texto + Imagem' },
                    ]}
                    placeholder={null}
                />
                {form.type !== 'text' && (
                    <Input
                        label="URL da mídia"
                        value={form.media_url}
                        onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))}
                        placeholder="https://..."
                    />
                )}
                <div>
                    <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                        Corpo da mensagem
                    </label>
                    <div className="flex gap-1.5 mb-2">
                        {['name', 'phone', 'theme'].map(v => (
                            <button
                                key={v}
                                type="button"
                                onClick={() => insertVar(v)}
                                className="px-2 py-1 rounded text-xs font-medium transition-colors"
                                style={{ backgroundColor: '#dce9f5', color: '#163d6e' }}
                            >
                                {`{${v}}`}
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={form.body}
                        onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                        placeholder="Olá {name}! Sua mensagem aqui..."
                        rows={8}
                        required
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all"
                    />
                </div>
            </div>

            {/* Right: preview */}
            <div className="p-5 flex flex-col">
                <p style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 12 }}>
                    Preview WhatsApp
                </p>
                {/* Phone mockup */}
                <div className="flex-1 bg-[#e5ddd5] rounded-2xl p-3 flex flex-col justify-end" style={{ minHeight: 240, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b0a89a' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
                    {form.body ? (
                        <div className="wapp-bubble px-3 py-2 max-w-[90%] self-end">
                            <p
                                className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: highlightVariables(form.body) }}
                            />
                            <p className="text-right text-xs text-gray-500 mt-1">09:00 ✓✓</p>
                        </div>
                    ) : (
                        <p className="text-center text-xs text-gray-500">Digite a mensagem para ver o preview...</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function Messages() {
    const { templates, loading, createTemplate, updateTemplate, deleteTemplate } = useMessages()
    const { toast } = useToast()
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
    const openEdit = (t) => { setEditing(t); setForm({ name: t.name, body: t.body, type: t.type, media_url: t.media_url || '' }); setModal(true) }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) { await updateTemplate(editing.id, form); toast('Template atualizado', 'success') }
            else { await createTemplate(form); toast('Template criado', 'success') }
            setModal(false)
        } catch (err) { toast(err.message, 'error') }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try { await deleteTemplate(deleteDialog.id); toast('Template excluído', 'success'); setDeleteDialog(null) }
        catch (err) { toast(err.message, 'error') }
        finally { setDeleting(false) }
    }

    return (
        <div className="page-enter">
            <TopBar
                title="Templates de mensagem"
                subtitle="Crie mensagens reutilizáveis com variáveis dinâmicas"
                actions={<Button onClick={openCreate} icon={<Plus size={15} />}>Novo template</Button>}
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-gray-100" />)}
                </div>
            ) : templates.length === 0 ? (
                <EmptyState
                    icon={<MessageSquare size={32} />}
                    title="Nenhum template criado"
                    description="Crie templates para enviar mensagens padronizadas."
                    action={openCreate}
                    actionLabel="Novo template"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map(t => (
                        <TemplateCard key={t.id} tpl={t} onEdit={openEdit} onDelete={setDeleteDialog} />
                    ))}
                </div>
            )}

            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar template' : 'Novo template'} size="xl">
                <form onSubmit={handleSave} className="flex flex-col h-full">
                    <TemplateEditor form={form} setForm={setForm} />
                    <div className="flex gap-3 justify-end p-4 border-t border-gray-100">
                        <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
                        <Button type="submit" loading={saving}>Salvar template</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Excluir template"
                message={`Tem certeza que deseja excluir o template "${deleteDialog?.name}"?`}
                confirmLabel="Excluir"
            />
        </div>
    )
}
