import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Users, Tag, Layers, MessageSquare, Send,
    FileText, Bell, ClipboardList, LogOut, Zap
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const nav = [
    { to: '/', icon: <LayoutDashboard size={18} strokeWidth={1.75} />, label: 'Dashboard', end: true },
    { to: '/contacts', icon: <Users size={18} strokeWidth={1.75} />, label: 'Contatos' },
    { to: '/themes', icon: <Layers size={18} strokeWidth={1.75} />, label: 'Temas' },
    { to: '/tags', icon: <Tag size={18} strokeWidth={1.75} />, label: 'Tags' },
    null, // divider
    { to: '/messages', icon: <MessageSquare size={18} strokeWidth={1.75} />, label: 'Templates' },
    { to: '/send', icon: <Send size={18} strokeWidth={1.75} />, label: 'Enviar' },
    null,
    { to: '/forms', icon: <FileText size={18} strokeWidth={1.75} />, label: 'Formulários' },
    { to: '/alarms', icon: <Bell size={18} strokeWidth={1.75} />, label: 'Alarmes' },
    { to: '/logs', icon: <ClipboardList size={18} strokeWidth={1.75} />, label: 'Logs' },
]

export default function Sidebar() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = () => {
        signOut()
        navigate('/login')
    }

    const initials = user?.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
        : user?.email?.[0]?.toUpperCase() || 'U'

    return (
        <aside className="w-[220px] shrink-0 h-screen flex flex-col bg-brand-900 sticky top-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
                <div className="w-8 h-8 rounded-xl bg-brand-400 flex items-center justify-center">
                    <Zap size={16} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-white font-bold text-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.01em' }}>
                    ZapCRM
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                {nav.map((item, i) => {
                    if (item === null) return <div key={`div-${i}`} className="my-2 border-t border-white/10" />
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm transition-all duration-150
                                ${isActive
                                    ? 'bg-white/15 text-white font-medium'
                                    : 'text-white/60 hover:bg-white/10 hover:text-white/90'
                                }
                            `}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    )
                })}
            </nav>

            {/* User */}
            <div className="px-3 py-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-brand-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                            {user?.user_metadata?.full_name || 'Usuário'}
                        </div>
                        <div className="text-xs text-white/50 truncate">{user?.email}</div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="text-white/40 hover:text-white/80 transition-colors p-1 rounded"
                        title="Sair"
                    >
                        <LogOut size={14} strokeWidth={1.75} />
                    </button>
                </div>
            </div>
        </aside>
    )
}
