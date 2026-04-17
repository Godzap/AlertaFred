import { useState } from 'react'
import { Plus, Pencil, Trash2, Tag as TagIcon, Users } from 'lucide-react'
import { useTags } from '../hooks/useTags'
import { useToast } from '../components/ui/Toast'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'

const COLORS = ['#ef4444','#f59e0b','#3b82f6','#8b5cf6','#10b981','#6b7a8d','#ec4899','#06b6d4','#84cc16','#f97316']
const EMPTY = { name: '', color: '#4a8ad4' }

export default function Tags() {
    const { tags, loading, createTag, updateTag, deleteTag } = useTags()
    const { toast } = useToast()
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
    const openEdit = (t) => { setEditing(t); setForm({ name: t.name, color: t.color }); setModal(true) }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) { await updateTag(editing.id, form); toast('Tag atualizada', 'success') }
            else { await createTag(form); toast('Tag criada', 'success') }
            setModal(false)
        } catch (err) { toast(err.message, 'error') }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try { await deleteTag(deleteDialog.id); toast('Tag excluída', 'success'); setDeleteDialog(null) }
        catch (err) { toast(err.message, 'error') }
        finally { setDeleting(false) }
    }

    return (
        <div className="page-enter">
            <TopBar
                title="Tags"
                subtitle="Etiquetas para classificar contatos"
                actions={<Button onClick={openCreate} icon={<Plus size={15} />}>Nova tag</Button>}
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100" />
                    ))}
                </div>
            ) : tags.length === 0 ? (
                <EmptyState
                    icon={<TagIcon size={32} />}
                    title="Nenhuma tag criada"
                    description="Crie tags para etiquetar seus contatos."
                    action={openCreate}
                    actionLabel="Nova tag"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {tags.map(t => (
                        <div
                            key={t.id}
                            className="bg-white rounded-xl shadow-card border border-gray-100 hover:shadow-card-md transition-all duration-200 px-4 py-3 flex items-center gap-3 group"
                        >
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{t.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Users size={11} className="text-gray-400" />
                                    <span className="text-xs text-gray-400">{t.contact_count} contato{t.contact_count !== 1 ? 's' : ''}</span>
                                </div>
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
                    ))}
                </div>
            )}

            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar tag' : 'Nova tag'} size="sm">
                <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                    <Input label="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome da tag" required />
                    <div>
                        <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Cor</label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                                    className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
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
                title="Excluir tag"
                message={`Tem certeza que deseja excluir a tag "${deleteDialog?.name}"?`}
                confirmLabel="Excluir"
            />
        </div>
    )
}
