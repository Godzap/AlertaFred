import { useState } from 'react'
import { Plus, Pencil, Trash2, Bell, Play, Pause, Zap } from 'lucide-react'
import { useAlarms } from '../hooks/useAlarms'
import { useToast } from '../components/ui/Toast'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Toggle from '../components/ui/Toggle'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'

function AlarmCard({ alarm, onEdit, onDelete, onToggle }) {
    const statusBadge = alarm.status === 'active' ? 'active' : alarm.status === 'paused' ? 'paused' : 'completed'

    let nextRunDisplay = ''
    try { nextRunDisplay = alarm.next_run ? new Date(alarm.next_run).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—' } catch {}

    return (
        <div className={`bg-white rounded-2xl shadow-card border transition-all duration-200 hover:shadow-card-md p-5 flex flex-col gap-4 ${alarm.status === 'paused' ? 'border-amber-100 opacity-75' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            {alarm.name}
                        </h3>
                        <Badge status={statusBadge} />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{alarm.template?.name || '—'}</p>
                </div>
                <Toggle checked={alarm.status === 'active'} onChange={() => onToggle(alarm.id)} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">Destinatários</p>
                    <p className="text-sm font-semibold text-gray-700">{alarm.target_label}</p>
                    <p className="text-xs text-brand-600 font-medium">{alarm.recipient_count} contato{alarm.recipient_count !== 1 ? 's' : ''}</p>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2">
                    <p className="text-xs text-gray-400 mb-0.5">Próximo disparo</p>
                    <p className="text-sm font-semibold text-gray-700">{nextRunDisplay}</p>
                    <p className="text-xs text-gray-400">{alarm.schedule_label}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                <button
                    onClick={() => onEdit(alarm)}
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                >
                    <Pencil size={12} /> Editar
                </button>
                <button
                    className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                    title="Disparar agora (teste)"
                >
                    <Zap size={12} /> Testar
                </button>
                <button
                    onClick={() => onDelete(alarm)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    )
}

export default function Alarms() {
    const { alarms, loading, deleteAlarm, toggleStatus } = useAlarms()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [deleteDialog, setDeleteDialog] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        try { await deleteAlarm(deleteDialog.id); toast('Alarme excluído', 'success'); setDeleteDialog(null) }
        catch (err) { toast(err.message, 'error') }
        finally { setDeleting(false) }
    }

    const handleToggle = async (id) => {
        await toggleStatus(id)
        const alarm = alarms.find(a => a.id === id)
        toast(alarm?.status === 'active' ? 'Alarme pausado' : 'Alarme ativado', 'success')
    }

    const active = alarms.filter(a => a.status === 'active')
    const paused = alarms.filter(a => a.status === 'paused')

    return (
        <div className="page-enter">
            <TopBar
                title="Alarmes"
                subtitle="Agendamentos automáticos de mensagens"
                actions={<Button onClick={() => navigate('/alarms/new')} icon={<Plus size={15} />}>Novo alarme</Button>}
            />

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />)}
                </div>
            ) : alarms.length === 0 ? (
                <EmptyState
                    icon={<Bell size={32} />}
                    title="Nenhum alarme criado"
                    description="Crie alarmes para automatizar o envio de mensagens."
                    action={() => navigate('/alarms/new')}
                    actionLabel="Novo alarme"
                />
            ) : (
                <div>
                    {active.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ativos ({active.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {active.map(a => <AlarmCard key={a.id} alarm={a} onEdit={a => navigate(`/alarms/${a.id}/edit`)} onDelete={setDeleteDialog} onToggle={handleToggle} />)}
                            </div>
                        </div>
                    )}
                    {paused.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pausados ({paused.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paused.map(a => <AlarmCard key={a.id} alarm={a} onEdit={a => navigate(`/alarms/${a.id}/edit`)} onDelete={setDeleteDialog} onToggle={handleToggle} />)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ConfirmDialog
                open={!!deleteDialog}
                onClose={() => setDeleteDialog(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Excluir alarme"
                message={`Tem certeza que deseja excluir o alarme "${deleteDialog?.name}"?`}
                confirmLabel="Excluir"
            />
        </div>
    )
}
