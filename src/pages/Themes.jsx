import { useState } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { useThemes } from '../hooks/useThemes'
import { useToast } from '../components/ui/Toast'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import EmptyState from '../components/ui/EmptyState'

const COLORS = ['#1a5192','#10b981','#f59e0b','#8b5cf6','#ef4444','#3b82f6','#06b6d4','#ec4899','#84cc16','#f97316']
const EMPTY = { name: '', description: '', color: '#1a5192' }

export default function Themes() {
    const { themes, loading, createTheme, updateTheme, deleteTheme } = useThemes()
    const { toast } = useToast()
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
    const openEdit = (t) => { setEditing(t); setForm({ name: t.name, description: t.description, color: t.color }); setModal(true) }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) { await updateTheme(editing.id, form); toast('Tema atualizado', 'success') }
            else { await createTheme(form); toast('Tema criado', 'success') }
            setModal(false)
        } catch (err) { toast(err.message, 'error') }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try { await deleteTheme(deleteDialog.id); toast('Tema excluído', 'success'); setDeleteDialog(null) }
        catch (err) { toast(err.message, 'error') }
        finally { setDeleting(false) }
    }

    return (
        <div className="page-enter">
            <TopBar
                title="Temas"
                subtitle="Categorize seus contatos por temas"
                actions={<Button onClick={openCreate} icon={<Plus size={15} />}>Novo tema</Button>}
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : themes.length === 0 ? (
                <EmptyState
                    icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" /><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>}
                    title="Nenhum tema criado"
                    description="Crie temas para organizar seus contatos."
                    action={openCreate}
                    actionLabel="Novo tema"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {themes.map(t => (
                        <div
                            key={t.id}
                            className="bg-white rounded-2xl shadow-card border border-gray-100 hover:shadow-card-md transition-all duration-200 hover:-translate-y-px flex overflow-hidden group"
                        >
                            <div className="w-1 shrink-0" style={{ backgroundColor: t.color }} />
                            <div className="flex-1 p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{t.name}</h3>
                                        {t.description && <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(t)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                                            <Pencil size={13} />
                                        </button>
                                        <button onClick={() => setDeleteDialog(t)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 mt-3">
                                    <Users size={13} className="text-gray-400" />
                                    <span className="text-xs text-gray-400">{t.contact_count} contato{t.contact_count !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar tema' : 'Novo tema'} size="sm">
                <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                    <Input label="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do tema" required />
                    <Textarea label="Descrição" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição opcional..." rows={2} />
                    <div>
                        <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Cor</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, color: c }))}
                                    className={`w-7 h-7 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: c, ringColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
                        <Button type="submit" loading={saving}>Salvar</Button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Excluir tema"
                message={`Tem certeza que deseja excluir o tema "${deleteDialog?.name}"? Os contatos associados não serão excluídos.`}
                confirmLabel="Excluir"
            />
        </div>
    )
}
