import { useState } from 'react'
import { Plus, Upload, Download, Trash2, Pencil, ChevronUp, ChevronDown } from 'lucide-react'
import { useContacts } from '../hooks/useContacts'
import { useThemes } from '../hooks/useThemes'
import { useTags } from '../hooks/useTags'
import { useToast } from '../components/ui/Toast'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import SearchInput from '../components/ui/SearchInput'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import MultiSelect from '../components/ui/MultiSelect'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonRow } from '../components/ui/Skeleton'
import ImportModal from '../components/ImportModal'

const EMPTY_FORM = { name: '', phone: '', email: '', birthday: '', notes: '', status: 'active', theme_ids: [], tag_ids: [], themes: [], tags: [] }

export default function Contacts() {
    const [filters, setFilters] = useState({ page: 1, perPage: 20 })
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [themeFilter, setThemeFilter] = useState('')

    const { contacts, loading, total, createContact, updateContact, deleteContact, deleteMany, importContacts } = useContacts({
        ...filters, search, status: statusFilter, theme_id: themeFilter
    })
    const { themes } = useThemes()
    const { tags } = useTags()
    const { toast } = useToast()

    const [importModal, setImportModal] = useState(false)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [selected, setSelected] = useState([])
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const setF = (k) => (v) => setForm(f => ({ ...f, [k]: typeof v === 'string' ? v : v }))
    const setFE = (k) => (e) => setF(k)(e.target.value)

    const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true) }
    const openEdit = (c) => {
        setEditing(c)
        setForm({ ...c, theme_ids: c.themes?.map(t => t.id) || [], tag_ids: c.tags?.map(t => t.id) || [] })
        setModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) {
                await updateContact(editing.id, form)
                toast('Contato atualizado', 'success')
            } else {
                await createContact(form)
                toast('Contato criado', 'success')
            }
            setModal(false)
        } catch (err) {
            toast(err.message, 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            if (deleteDialog.type === 'single') {
                await deleteContact(deleteDialog.id)
            } else {
                await deleteMany(selected)
                setSelected([])
            }
            toast('Contato(s) excluído(s)', 'success')
            setDeleteDialog(null)
        } catch (err) {
            toast(err.message, 'error')
        } finally {
            setDeleting(false)
        }
    }

    const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
    const toggleAll = () => setSelected(s => s.length === contacts.length ? [] : contacts.map(c => c.id))

    const themeOptions = themes.map(t => ({ value: t.id, label: t.name, color: t.color }))
    const tagOptions = tags.map(t => ({ value: t.id, label: t.name, color: t.color }))

    return (
        <div className="page-enter">
            <TopBar
                title="Contatos"
                subtitle={`${total} contato${total !== 1 ? 's' : ''} cadastrado${total !== 1 ? 's' : ''}`}
                actions={
                    <>
                        <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => setImportModal(true)}>Importar</Button>
                        <Button variant="secondary" size="sm" icon={<Download size={14} />}>Exportar</Button>
                        <Button onClick={openCreate} icon={<Plus size={15} />}>Novo contato</Button>
                    </>
                }
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-5 bg-white rounded-xl p-3 shadow-card border border-gray-100">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Buscar por nome ou telefone..."
                    className="flex-1 min-w-[200px]"
                />
                <div className="w-40">
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        placeholder="Status"
                        options={[
                            { value: 'active', label: 'Ativo' },
                            { value: 'inactive', label: 'Inativo' },
                            { value: 'blocked', label: 'Bloqueado' },
                        ]}
                    />
                </div>
                <div className="w-40">
                    <Select
                        value={themeFilter}
                        onChange={e => setThemeFilter(e.target.value)}
                        placeholder="Tema"
                        options={themeOptions}
                    />
                </div>
            </div>

            {/* Bulk actions */}
            {selected.length > 0 && (
                <div className="flex items-center gap-3 mb-4 bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 animate-fade-in">
                    <span className="text-sm text-brand-700 font-medium">{selected.length} selecionado(s)</span>
                    <Button
                        variant="dangerGhost"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => setDeleteDialog({ type: 'bulk' })}
                    >
                        Excluir selecionados
                    </Button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="w-10 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={selected.length === contacts.length && contacts.length > 0}
                                    onChange={toggleAll}
                                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-200"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nome</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Telefone</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">E-mail</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Aniversário</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Temas</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tags</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Origem</th>
                            <th className="w-20 px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        ) : contacts.length === 0 ? (
                            <tr>
                                <td colSpan={10}>
                                    <EmptyState
                                        icon={<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>}
                                        title="Nenhum contato encontrado"
                                        description="Crie seu primeiro contato ou ajuste os filtros."
                                        action={openCreate}
                                        actionLabel="Novo contato"
                                    />
                                </td>
                            </tr>
                        ) : contacts.map(c => (
                            <tr
                                key={c.id}
                                className="border-b border-gray-50 hover:bg-brand-50/40 transition-colors group"
                            >
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(c.id)}
                                        onChange={() => toggleSelect(c.id)}
                                        className="rounded border-gray-300 text-brand-600 focus:ring-brand-200"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-semibold shrink-0">
                                            {c.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                                            {c.notes && <p className="text-xs text-gray-400 truncate max-w-[140px]">{c.notes}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">{c.phone}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{c.email || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3 text-xs text-gray-600">{c.birthday || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {c.themes?.map(t => <Badge key={t.id} color={t.color}>{t.name}</Badge>)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {c.tags?.map(t => <Badge key={t.id} color={t.color}>{t.name}</Badge>)}
                                    </div>
                                </td>
                                <td className="px-4 py-3"><Badge status={c.status} /></td>
                                <td className="px-4 py-3">
                                    {c.origin
                                        ? <span className="text-xs text-gray-600">{c.origin}</span>
                                        : <Badge status={c.source}>{c.source}</Badge>
                                    }
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEdit(c)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                        >
                                            <Pencil size={13} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteDialog({ type: 'single', id: c.id, name: c.name })}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {total > filters.perPage && (
                    <div className="px-4 border-t border-gray-50">
                        <Pagination
                            page={filters.page}
                            total={total}
                            perPage={filters.perPage}
                            onChange={p => setFilters(f => ({ ...f, page: p }))}
                        />
                    </div>
                )}
            </div>

            {/* Modal create/edit */}
            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar contato' : 'Novo contato'} size="md">
                <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nome"
                            value={form.name}
                            onChange={setFE('name')}
                            placeholder="Nome completo"
                            required
                        />
                        <Input
                            label="Telefone"
                            value={form.phone}
                            onChange={setFE('phone')}
                            placeholder="+55 11 99999-9999"
                            required
                        />
                        <Input
                            label="E-mail"
                            value={form.email}
                            onChange={setFE('email')}
                            placeholder="nome@exemplo.com"
                            type="email"
                        />
                        <Input
                            label="Aniversário"
                            value={form.birthday}
                            onChange={e => {
                                const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                                const masked = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits
                                setForm(f => ({ ...f, birthday: masked }))
                            }}
                            placeholder="DD/MM"
                            maxLength={5}
                        />
                    </div>
                    <MultiSelect
                        label="Temas"
                        options={themeOptions}
                        value={form.theme_ids}
                        onChange={setF('theme_ids')}
                        placeholder="Selecionar temas..."
                    />
                    <MultiSelect
                        label="Tags"
                        options={tagOptions}
                        value={form.tag_ids}
                        onChange={setF('tag_ids')}
                        placeholder="Selecionar tags..."
                    />
                    <Select
                        label="Status"
                        value={form.status}
                        onChange={setFE('status')}
                        options={[
                            { value: 'active', label: 'Ativo' },
                            { value: 'inactive', label: 'Inativo' },
                            { value: 'blocked', label: 'Bloqueado' },
                        ]}
                    />
                    <Textarea
                        label="Notas"
                        value={form.notes}
                        onChange={setFE('notes')}
                        placeholder="Observações sobre o contato..."
                        rows={3}
                    />
                    <div className="flex gap-3 justify-end pt-2">
                        <Button type="button" variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
                        <Button type="submit" loading={saving}>Salvar</Button>
                    </div>
                </form>
            </Modal>

            {/* Import modal */}
            <ImportModal
                open={importModal}
                onClose={(count) => {
                    setImportModal(false)
                    if (count > 0) toast(`${count} contato(s) importado(s) com sucesso`, 'success')
                }}
                onImport={importContacts}
                tags={tags}
                themes={themes}
            />

            {/* Confirm delete */}
            <ConfirmDialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Excluir contato"
                message={
                    deleteDialog?.type === 'bulk'
                        ? `Tem certeza que deseja excluir ${selected.length} contato(s)? Esta ação não pode ser desfeita.`
                        : `Tem certeza que deseja excluir "${deleteDialog?.name}"? Esta ação não pode ser desfeita.`
                }
                confirmLabel="Excluir"
            />
        </div>
    )
}
