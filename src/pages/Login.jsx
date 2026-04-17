import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/Toast'

export default function Login() {
    const [mode, setMode] = useState('signin') // 'signin' | 'signup'
    const [form, setForm] = useState({ email: '', password: '', full_name: '' })
    const [loading, setLoading] = useState(false)
    const { signIn, signUp } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (mode === 'signin') {
                const { error } = await signIn({ email: form.email, password: form.password })
                if (error) throw new Error(error)
            } else {
                const { error } = await signUp(form)
                if (error) throw new Error(error)
            }
            navigate('/')
        } catch (err) {
            toast(err.message || 'Erro ao entrar', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #eef4fb 0%, #ffffff 60%)' }}>
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-3 shadow-card-md">
                        <Zap size={28} className="text-white" strokeWidth={2} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
                        ZapCRM
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">CRM de mensageria para WhatsApp</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-card-lg border border-gray-100 p-8">
                    <h2 className="text-base font-semibold text-gray-800 mb-6 text-center" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {mode === 'signin' ? 'Entrar na sua conta' : 'Criar nova conta'}
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {mode === 'signup' && (
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Nome completo"
                                    value={form.full_name}
                                    onChange={set('full_name')}
                                    className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={form.email}
                                onChange={set('email')}
                                className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Senha"
                                value={form.password}
                                onChange={set('password')}
                                className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-10 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                        >
                            {loading && <Loader2 size={15} className="animate-spin" />}
                            {mode === 'signin' ? 'Entrar' : 'Criar conta'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-5">
                        {mode === 'signin' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
                        <button
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-brand-600 font-medium hover:text-brand-700 transition-colors"
                        >
                            {mode === 'signin' ? 'Criar conta' : 'Entrar'}
                        </button>
                    </p>
                </div>

                <p className="text-center text-xs text-gray-300 mt-6">
                    © 2026 ZapCRM · Todos os direitos reservados
                </p>
            </div>
        </div>
    )
}
