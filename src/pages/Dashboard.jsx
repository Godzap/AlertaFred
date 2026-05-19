import { Users, UserCheck, Send, Bell, Clock, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useDashboard } from '../hooks/useDashboard'
import TopBar from '../components/layout/TopBar'
import StatsCard from '../components/ui/StatsCard'
import { SkeletonCard } from '../components/ui/Skeleton'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const actionLabels = {
    contact_created: 'Contato criado',
    contact_updated: 'Contato atualizado',
    contacts_imported: 'Contatos importados',
    alarm_triggered: 'Alarme disparado',
    alarm_paused: 'Alarme pausado',
    form_submitted: 'Formulário respondido',
    template_created: 'Template criado',
    message_sent: 'Mensagem enviada',
    tag_created: 'Tag criada',
}

const actionIcons = {
    contact_created: <Users size={14} />,
    contact_updated: <Users size={14} />,
    contacts_imported: <Users size={14} />,
    alarm_triggered: <Bell size={14} />,
    alarm_paused: <Bell size={14} />,
    form_submitted: <Activity size={14} />,
    template_created: <Send size={14} />,
    message_sent: <Send size={14} />,
    tag_created: <Activity size={14} />,
}

function ActivityItem({ log }) {
    const label = actionLabels[log.action] || log.action
    const icon = actionIcons[log.action] || <Activity size={14} />
    let detail = log.details?.contact_name || log.details?.alarm_name || log.details?.template_name || log.details?.tag_name || log.details?.form_title || ''
    if (log.action === 'contacts_imported') {
        const count = log.details?.count ?? 0
        const origin = log.details?.origin
        detail = origin ? `${count} contato${count !== 1 ? 's' : ''} de ${origin}` : `${count} contato${count !== 1 ? 's' : ''}`
    }

    let ago = ''
    try { ago = formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR }) } catch {}

    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                    <span className="font-medium">{label}</span>
                    {detail && <span className="text-gray-500"> · {detail}</span>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{ago}</p>
            </div>
        </div>
    )
}

function NextAlarmItem({ alarm }) {
    let display = ''
    try { display = new Date(alarm.next_run).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) } catch {}

    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{alarm.name}</p>
                <p className="text-xs text-gray-400 truncate">{alarm.target_label}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                <Clock size={11} />
                {display}
            </div>
        </div>
    )
}

export default function Dashboard() {
    const { data, loading } = useDashboard()

    return (
        <div className="page-enter">
            <TopBar
                title="Dashboard"
                subtitle="Visão geral do seu ZapCRM"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {loading ? (
                    [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    <>
                        <StatsCard icon={<Users size={18} />} label="Total de contatos" value={data.stats.totalContacts} color="brand" />
                        <StatsCard icon={<UserCheck size={18} />} label="Contatos ativos" value={data.stats.activeContacts} color="green" delta={8} />
                        <StatsCard icon={<Send size={18} />} label="Envios este mês" value={data.stats.sentThisMonth} color="amber" delta={12} />
                        <StatsCard icon={<Bell size={18} />} label="Alarmes ativos" value={data.stats.activeAlarms} color="brand" />
                    </>
                )}
            </div>

            {/* Charts + Lists */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
                {/* Bar chart */}
                <div className="xl:col-span-3 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Contatos por tema
                    </h3>
                    <p className="text-xs text-gray-400 mb-5">Top {data?.contactsByTheme?.length || 0} temas</p>
                    {!loading && data && (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data.contactsByTheme} layout="vertical" margin={{ left: 0, right: 20 }}>
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#8d99ae' }} axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: '#4a5568' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                />
                                <Tooltip
                                    contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #edf0f5', boxShadow: '0 4px 12px rgba(12,29,58,0.06)' }}
                                    cursor={{ fill: '#eef4fb' }}
                                />
                                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                                    {data.contactsByTheme.map((entry, i) => (
                                        <Cell key={i} fill={entry.color || '#4a8ad4'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Next alarms */}
                <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        Próximos alarmes
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">Agendados para disparar</p>
                    {!loading && data?.nextAlarms?.map(a => <NextAlarmItem key={a.id} alarm={a} />)}
                </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Atividade recente
                </h3>
                <p className="text-xs text-gray-400 mb-4">Últimas ações no sistema</p>
                {!loading && data?.activityLogs?.map(a => <ActivityItem key={a.id} log={a} />)}
            </div>
        </div>
    )
}
