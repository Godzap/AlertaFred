import { useState } from 'react'
import { Plus, Pencil, Trash2, Sheet } from 'lucide-react'
import { useAnniversaryPeople } from '../hooks/useAnniversaryPeople'
import { useMunicipalities } from '../hooks/useMunicipalities'
import { useToast } from '../components/ui/Toast'
import TopBar from '../components/layout/TopBar'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonRow } from '../components/ui/Skeleton'
import { maskDDMM } from '../lib/dateUtils'

const CATEGORIES = [
    { value: 'igreja', label: 'Igreja' },
    { value: 'municipios', label: 'Municípios' },
    { value: 'liderancas', label: 'Lideranças' },
]

const TIPO_OPTIONS = [
    { value: 'Nascimento', label: 'Nascimento' },
    { value: 'Ordenação Presbiteral', label: 'Ordenação Presbiteral' },
    { value: 'Ordenação Episcopal', label: 'Ordenação Episcopal' },
]

export default function Spreadsheets() {
    const [category, setCategory] = useState('igreja')

    return (
        <div className="page-enter">
            <TopBar title="Planilhas" subtitle="Bases de aniversários organizadas por categoria" />

            <div className="flex items-center gap-3 mb-5 bg-white rounded-xl p-3 shadow-card border border-gray-100">
                <Sheet size={16} className="text-gray-400 ml-1" />
                <div className="w-56">
                    <Select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        options={CATEGORIES}
                        placeholder={null}
                    />
                </div>
            </div>

            {category === 'igreja' && <IgrejaTable />}
            {category === 'municipios' && <MunicipiosTable />}
            {category === 'liderancas' && <LiderancasTable />}
        </div>
    )
}

function IgrejaTable() {
    const { people, loading, createPerson, updatePerson, deletePerson } = useAnniversaryPeople({ categoria: 'igreja' })
    const { toast } = useToast()
    const EMPTY = { nome: '', tipo_aniversario: 'Nascimento', data_aniversario: '' }
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
    const openEdit = (p) => {
        setEditing(p)
        setForm({ nome: p.nome, tipo_aniversario: p.tipo_aniversario || 'Nascimento', data_aniversario: p.data_aniversario || '' })
        setModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = { ...form, categoria: 'igreja', tags: ['Igreja'] }
            if (editing) { await updatePerson(editing.id, payload); toast('Pessoa atualizada', 'success') }
            else { await createPerson(payload); toast('Pessoa criada', 'success') }
            setModal(false)
        } catch (err) { toast(err.message, 'error') }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try { await deletePerson(deleteDialog.id); toast('Pessoa excluída', 'success'); setDeleteDialog(null) }
        catch (err) { toast(err.message, 'error') }
        finally { setDeleting(false) }
    }

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <p className="text-sm text-gray-500">{people.length} pessoa{people.length !== 1 ? 's' : ''}</p>
                <Button size="sm" onClick={openCreate} icon={<Plus size={14} />}>Nova pessoa</Button>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tipo de Aniversário</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Data</th>
                        <th className="w-20 px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {loading ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        : people.length === 0 ? (
                            <tr><td colSpan={4}>
                                <EmptyState icon={<Sheet size={32} />} title="Nenhuma pessoa cadastrada" description="Adicione pessoas da igreja com data de aniversário." action={openCreate} actionLabel="Nova pessoa" />
                            </td></tr>
                        ) : people.map(p => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-brand-50/40 transition-colors group">
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.nome}</td>
                                <td className="px-4 py-3">{p.tipo_aniversario ? <Badge color="#4a8ad4">{p.tipo_aniversario}</Badge> : <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">{p.data_aniversario || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(p)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Pencil size={13} /></button>
                                        <button onClick={() => setDeleteDialog({ id: p.id, nome: p.nome })} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar pessoa' : 'Nova pessoa'} size="sm">
                <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                    <Input label="Nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo" required />
                    <Select label="Tipo de Aniversário" value={form.tipo_aniversario} onChange={e => setForm(f => ({ ...f, tipo_aniversario: e.target.value }))} options={TIPO_OPTIONS} placeholder={null} />
                    <Input label="Data" value={form.data_aniversario} onChange={e => setForm(f => ({ ...f, data_aniversario: maskDDMM(e.target.value) }))} placeholder="DD/MM" maxLength={5} />
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
                title="Excluir pessoa"
                message={`Tem certeza que deseja excluir "${deleteDialog?.nome}"?`}
                confirmLabel="Excluir"
            />
        </div>
    )
}

function MunicipiosTable() {
    const { municipalities, loading, createMunicipality, updateMunicipality, deleteMunicipality } = useMunicipalities()
    const { toast } = useToast()
    const EMPTY = { nome: '', data_aniversario: '', instagram: '', nota: '' }
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
    const openEdit = (m) => {
        setEditing(m)
        setForm({ nome: m.nome, data_aniversario: m.data_aniversario || '', instagram: m.instagram || '', nota: m.nota || '' })
        setModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editing) { await updateMunicipality(editing.id, form); toast('Município atualizado', 'success') }
            else { await createMunicipality(form); toast('Município criado', 'success') }
            setModal(false)
        } catch (err) { toast(err.message, 'error') }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try { await deleteMunicipality(deleteDialog.id); toast('Município excluído', 'success'); setDeleteDialog(null) }
        catch (err) { toast(err.message, 'error') }
        finally { setDeleting(false) }
    }

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <p className="text-sm text-gray-500">{municipalities.length} município{municipalities.length !== 1 ? 's' : ''}</p>
                <Button size="sm" onClick={openCreate} icon={<Plus size={14} />}>Novo município</Button>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Aniversário</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Instagram</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nota</th>
                        <th className="w-20 px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {loading ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        : municipalities.length === 0 ? (
                            <tr><td colSpan={5}>
                                <EmptyState icon={<Sheet size={32} />} title="Nenhum município cadastrado" description="Adicione municípios com data de aniversário/fundação." action={openCreate} actionLabel="Novo município" />
                            </td></tr>
                        ) : municipalities.map(m => (
                            <tr key={m.id} className="border-b border-gray-50 hover:bg-brand-50/40 transition-colors group">
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.nome}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">{m.data_aniversario || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{m.instagram || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3 text-xs text-gray-400 truncate max-w-[220px]" title={m.nota || ''}>{m.nota || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(m)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Pencil size={13} /></button>
                                        <button onClick={() => setDeleteDialog({ id: m.id, nome: m.nome })} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar município' : 'Novo município'} size="sm">
                <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                    <Input label="Nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome do município" required />
                    <Input label="Data de aniversário" value={form.data_aniversario} onChange={e => setForm(f => ({ ...f, data_aniversario: maskDDMM(e.target.value) }))} placeholder="DD/MM" maxLength={5} />
                    <Input label="Instagram" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@perfil" />
                    <Input label="Nota" value={form.nota} onChange={e => setForm(f => ({ ...f, nota: e.target.value }))} placeholder="Observação sobre a fonte da data" />
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
                title="Excluir município"
                message={`Tem certeza que deseja excluir "${deleteDialog?.nome}"? Pessoas linkadas perderão a referência.`}
                confirmLabel="Excluir"
            />
        </div>
    )
}

function LiderancasTable() {
    const { people, loading, createPerson, updatePerson, deletePerson } = useAnniversaryPeople({ categoria: 'lideranca' })
    const { municipalities } = useMunicipalities()
    const { toast } = useToast()
    const EMPTY = { nome: '', cargo: '', municipio_id: '', data_aniversario: '' }
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const municipioOptions = municipalities.map(m => ({ value: m.id, label: m.nome }))

    const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
    const openEdit = (p) => {
        setEditing(p)
        setForm({ nome: p.nome, cargo: p.cargo || '', municipio_id: p.municipio_id || '', data_aniversario: p.data_aniversario || '' })
        setModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                nome: form.nome,
                cargo: form.cargo,
                data_aniversario: form.data_aniversario || null,
                municipio_id: form.municipio_id || null,
                categoria: 'lideranca',
                tags: ['Liderança'],
            }
            if (editing) { await updatePerson(editing.id, payload); toast('Liderança atualizada', 'success') }
            else { await createPerson(payload); toast('Liderança criada', 'success') }
            setModal(false)
        } catch (err) { toast(err.message, 'error') }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try { await deletePerson(deleteDialog.id); toast('Liderança excluída', 'success'); setDeleteDialog(null) }
        catch (err) { toast(err.message, 'error') }
        finally { setDeleting(false) }
    }

    return (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <p className="text-sm text-gray-500">{people.length} liderança{people.length !== 1 ? 's' : ''}</p>
                <Button size="sm" onClick={openCreate} icon={<Plus size={14} />}>Nova liderança</Button>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Cargo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Município</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Data</th>
                        <th className="w-20 px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {loading ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        : people.length === 0 ? (
                            <tr><td colSpan={5}>
                                <EmptyState icon={<Sheet size={32} />} title="Nenhuma liderança cadastrada" description="Adicione lideranças políticas linkadas a um município." action={openCreate} actionLabel="Nova liderança" />
                            </td></tr>
                        ) : people.map(p => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-brand-50/40 transition-colors group">
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.nome}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{p.cargo || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{p.municipio?.nome || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">{p.data_aniversario || <span className="text-gray-300">—</span>}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(p)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Pencil size={13} /></button>
                                        <button onClick={() => setDeleteDialog({ id: p.id, nome: p.nome })} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar liderança' : 'Nova liderança'} size="sm">
                <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
                    <Input label="Nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo" required />
                    <Input label="Cargo" value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} placeholder="Ex: Prefeito" />
                    <Select label="Município" value={form.municipio_id} onChange={e => setForm(f => ({ ...f, municipio_id: e.target.value }))} options={municipioOptions} placeholder="Selecionar município..." />
                    <Input label="Data (se conhecida)" value={form.data_aniversario} onChange={e => setForm(f => ({ ...f, data_aniversario: maskDDMM(e.target.value) }))} placeholder="DD/MM" maxLength={5} />
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
                title="Excluir liderança"
                message={`Tem certeza que deseja excluir "${deleteDialog?.nome}"?`}
                confirmLabel="Excluir"
            />
        </div>
    )
}
