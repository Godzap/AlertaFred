import { useState } from 'react'
import { Plus, Pencil, Trash2, Copy, ExternalLink, FileText } from 'lucide-react'
import { useForms } from '../hooks/useForms'
import { useThemes } from '../hooks/useThemes'
import { useToast } from '../components/ui/Toast'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Toggle from '../components/ui/Toggle'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'

export default function Forms() {
    const { forms, loading, updateForm, deleteForm } = useForms()
    const { themes } = useThemes()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const handleToggle = async (form) => {
        await updateForm(form.id, { active: !form.active })
        toast(form.active ? 'Formulário desativado' : 'Formulário ativado', 'success')
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await deleteForm(deleteDialog.id)
            toast('Formulário excluído', 'success')
            setDeleteDialog(null)
        } catch (err) {
            toast(err.message, 'error')
        } finally {
            setDeleting(false)
        }
    }

    const copyLink = (slug) => {
        navigator.clipboard.writeText(`${window.location.origin}/f/${slug}`)
        toast('Link copiado!', 'success')
    }

    const themeMap = Object.fromEntries(themes.map(t => [t.id, t]))

    return (
        <div className="page-enter">
            <TopBar
                title="Formulários"
                subtitle="Crie formulários públicos de captação"
                actions={<Button onClick={() => navigate('/forms/new')} icon={<Plus size={15} />}>Novo formulário</Button>}
            />

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />)}
                </div>
            ) : forms.length === 0 ? (
                <EmptyState
                    icon={<FileText size={32} />}
                    title="Nenhum formulário criado"
                    description="Crie formulários públicos para captar novos contatos."
                    action={() => navigate('/forms/new')}
                    actionLabel="Novo formulário"
                />
            ) : (
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Formulário</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tema automático</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Submissões</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                                <th className="w-32 px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {forms.map(f => (
                                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-400 font-mono">/f/{f.slug}</span>
                                            <button
                                                onClick={() => copyLink(f.slug)}
                                                className="text-gray-400 hover:text-brand-600 transition-colors"
                                                title="Copiar link"
                                            >
                                                <Copy size={11} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {f.auto_theme_id && themeMap[f.auto_theme_id] ? (
                                            <Badge color={themeMap[f.auto_theme_id].color}>{themeMap[f.auto_theme_id].name}</Badge>
                                        ) : <span className="text-xs text-gray-400">—</span>}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-semibold text-gray-700">{f.submissions || 0}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Toggle checked={f.active} onChange={() => handleToggle(f)} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => window.open(`/f/${f.slug}`, '_blank')}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                                title="Abrir formulário público"
                                            >
                                                <ExternalLink size={13} />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/forms/${f.id}/edit`)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                                            >
                                                <Pencil size={13} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteDialog(f)}
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
                </div>
            )}

            <ConfirmDialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Excluir formulário"
                message={`Tem certeza que deseja excluir o formulário "${deleteDialog?.title}"?`}
                confirmLabel="Excluir"
            />
        </div>
    )
}
