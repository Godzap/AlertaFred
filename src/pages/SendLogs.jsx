import { useState } from 'react'
import { ChevronDown, ClipboardList } from 'lucide-react'
import { useSendLogs } from '../hooks/useSendLogs'
import TopBar from '../components/layout/TopBar'
import Badge from '../components/ui/Badge'
import SearchInput from '../components/ui/SearchInput'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonRow } from '../components/ui/Skeleton'

function LogRow({ log }) {
    const [expanded, setExpanded] = useState(false)
    let dateStr = ''
    try { dateStr = new Date(log.sent_at).toLocaleString('pt-BR') } catch {}

    return (
        <>
            <tr
                className="border-b border-gray-50 hover:bg-brand-50/40 transition-colors cursor-pointer"
                onClick={() => setExpanded(e => !e)}
            >
                <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{dateStr}</td>
                <td className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-800">{log.contact_name || '—'}</p>
                    <p className="text-xs text-gray-400 font-mono">{log.phone}</p>
                </td>
                <td className="px-5 py-3">
                    <p className="text-sm text-gray-600 line-clamp-1 max-w-[300px]">{log.message_body}</p>
                </td>
                <td className="px-5 py-3">
                    <span className="text-xs text-gray-500">{log.alarm_name || '—'}</span>
                </td>
                <td className="px-5 py-3">
                    <Badge status={log.status} />
                </td>
                <td className="px-5 py-3">
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </td>
            </tr>
            {expanded && (
                <tr className="bg-gray-50">
                    <td colSpan={6} className="px-5 py-4">
                        <div className="bg-white rounded-xl p-4 text-sm text-gray-600 whitespace-pre-wrap border border-gray-100">
                            {log.message_body}
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

export default function SendLogs() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const { logs, loading, total } = useSendLogs({ search, status: statusFilter })

    return (
        <div className="page-enter">
            <TopBar
                title="Logs de envio"
                subtitle={`${total} registro${total !== 1 ? 's' : ''}`}
            />

            <div className="flex flex-wrap items-center gap-3 mb-5 bg-white rounded-xl p-3 shadow-card border border-gray-100">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Buscar por contato ou telefone..."
                    className="flex-1 min-w-[200px]"
                />
                <div className="w-44">
                    <Select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        placeholder="Status"
                        options={[
                            { value: 'simulated', label: 'Simulado' },
                            { value: 'sent', label: 'Enviado' },
                            { value: 'delivered', label: 'Entregue' },
                            { value: 'read', label: 'Lido' },
                            { value: 'failed', label: 'Falhou' },
                        ]}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Data/Hora</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Contato</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Mensagem</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Alarme</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                            <th className="w-10 px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    <EmptyState
                                        icon={<ClipboardList size={32} />}
                                        title="Nenhum registro encontrado"
                                        description="Os logs de envio aparecerão aqui após o disparo de mensagens."
                                    />
                                </td>
                            </tr>
                        ) : logs.map(l => <LogRow key={l.id} log={l} />)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
