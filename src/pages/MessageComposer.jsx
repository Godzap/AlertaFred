import { useState } from 'react'
import { Check, ChevronRight, ChevronLeft, Send, Users } from 'lucide-react'
import { useMessages } from '../hooks/useMessages'
import { useThemes } from '../hooks/useThemes'
import { useTags } from '../hooks/useTags'
import { useContacts } from '../hooks/useContacts'
import { useSendLogs } from '../hooks/useSendLogs'
import { useToast } from '../components/ui/Toast'
import { renderTemplate, highlightVariables } from '../lib/templateEngine'
import TopBar from '../components/layout/TopBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const STEPS = ['Mensagem', 'Destinatários', 'Confirmar']

export default function MessageComposer() {
    const [step, setStep] = useState(0)
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [targetType, setTargetType] = useState('all')
    const [targetIds, setTargetIds] = useState([])
    const [done, setDone] = useState(false)
    const [sending, setSending] = useState(false)

    const { templates } = useMessages()
    const { themes } = useThemes()
    const { tags } = useTags()
    const { contacts } = useContacts({ status: 'active' })
    const { addLog } = useSendLogs()
    const { toast } = useToast()

    const getRecipients = () => {
        if (targetType === 'all') return contacts
        if (targetType === 'theme') return contacts.filter(c => c.themes?.some(t => targetIds.includes(t.id)))
        if (targetType === 'tag') return contacts.filter(c => c.tags?.some(t => targetIds.includes(t.id)))
        return contacts.filter(c => targetIds.includes(c.id))
    }

    const recipients = getRecipients()

    const handleSend = async () => {
        setSending(true)
        await new Promise(r => setTimeout(r, 1200))
        for (const c of recipients) {
            await addLog({
                contact_id: c.id,
                contact_name: c.name,
                phone: c.phone,
                message_template_id: selectedTemplate?.id,
                message_body: renderTemplate(selectedTemplate?.body, c),
                status: 'simulated',
            })
        }
        setSending(false)
        setDone(true)
        toast(`${recipients.length} mensagem(ns) simulada(s) com sucesso!`, 'success')
    }

    if (done) {
        return (
            <div className="page-enter flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-scale-in">
                    <Check size={40} className="text-emerald-500" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Mensagens enviadas!
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    {recipients.length} mensagem{recipients.length !== 1 ? 'ns' : ''} simulada{recipients.length !== 1 ? 's' : ''} com sucesso.
                </p>
                <Button onClick={() => { setStep(0); setSelectedTemplate(null); setTargetType('all'); setTargetIds([]); setDone(false) }}>
                    Nova mensagem
                </Button>
            </div>
        )
    }

    return (
        <div className="page-enter max-w-3xl">
            <TopBar title="Enviar mensagem" subtitle="Wizard de envio em 3 passos" />

            {/* Stepper */}
            <div className="flex items-center gap-0 mb-8">
                {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center flex-1 last:flex-none">
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                                i < step ? 'bg-brand-600 text-white' :
                                i === step ? 'bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse-soft' :
                                'bg-gray-100 text-gray-400'
                            }`}>
                                {i < step ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                            </div>
                            <span className={`text-sm font-medium ${i === step ? 'text-gray-800' : 'text-gray-400'}`}>{s}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-px mx-3 ${i < step ? 'bg-brand-300' : 'bg-gray-200'}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step 0: Template */}
            {step === 0 && (
                <div className="animate-fade-in">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Selecione um template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {templates.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setSelectedTemplate(t)}
                                className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                                    selectedTemplate?.id === t.id
                                        ? 'border-brand-500 bg-brand-50'
                                        : 'border-gray-200 bg-white hover:border-brand-200 hover:bg-brand-50/40'
                                }`}
                            >
                                <p className="text-sm font-semibold text-gray-800 mb-1">{t.name}</p>
                                <p className="text-xs text-gray-500 line-clamp-2">{t.body}</p>
                                <Badge status={t.type} className="mt-2">{t.type}</Badge>
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button
                            icon={<ChevronRight size={15} />}
                            disabled={!selectedTemplate}
                            onClick={() => setStep(1)}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 1: Destinatários */}
            {step === 1 && (
                <div className="animate-fade-in">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Selecione os destinatários</h3>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
                        {[
                            { value: 'all', label: 'Todos os contatos ativos' },
                            { value: 'theme', label: 'Por tema' },
                            { value: 'tag', label: 'Por tag' },
                        ].map(opt => (
                            <label key={opt.value} className="flex items-center gap-3 py-2.5 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="target"
                                    value={opt.value}
                                    checked={targetType === opt.value}
                                    onChange={() => { setTargetType(opt.value); setTargetIds([]) }}
                                    className="text-brand-600 focus:ring-brand-200"
                                />
                                <span className="text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}

                        {targetType === 'theme' && (
                            <div className="mt-3 flex flex-wrap gap-2 pl-7">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setTargetIds(ids => ids.includes(t.id) ? ids.filter(x => x !== t.id) : [...ids, t.id])}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                            targetIds.includes(t.id) ? 'border-transparent text-white' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                                        }`}
                                        style={targetIds.includes(t.id) ? { backgroundColor: t.color, borderColor: t.color } : {}}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {targetType === 'tag' && (
                            <div className="mt-3 flex flex-wrap gap-2 pl-7">
                                {tags.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setTargetIds(ids => ids.includes(t.id) ? ids.filter(x => x !== t.id) : [...ids, t.id])}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                            targetIds.includes(t.id) ? 'border-transparent text-white' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                                        }`}
                                        style={targetIds.includes(t.id) ? { backgroundColor: t.color, borderColor: t.color } : {}}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 flex items-center gap-2 mb-6">
                        <Users size={15} className="text-brand-500" />
                        <span className="text-sm text-brand-700 font-medium">
                            {recipients.length} contato{recipients.length !== 1 ? 's' : ''} selecionado{recipients.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <Button variant="secondary" icon={<ChevronLeft size={15} />} onClick={() => setStep(0)}>Voltar</Button>
                        <Button
                            icon={<ChevronRight size={15} />}
                            disabled={recipients.length === 0}
                            onClick={() => setStep(2)}
                        >
                            Próximo
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Confirmar */}
            {step === 2 && (
                <div className="animate-fade-in">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Confirmar envio</h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Template</p>
                            <p className="text-sm font-semibold text-gray-800">{selectedTemplate?.name}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-3">{selectedTemplate?.body}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Destinatários</p>
                            <p className="text-2xl font-bold text-brand-600" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                {recipients.length}
                            </p>
                            <p className="text-xs text-gray-500">contato{recipients.length !== 1 ? 's' : ''} ativo{recipients.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {/* Preview dos primeiros 3 */}
                    {recipients.slice(0, 3).length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Prévia das mensagens</p>
                            <div className="flex flex-col gap-2">
                                {recipients.slice(0, 3).map(c => (
                                    <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">{c.name} · {c.phone}</p>
                                        <p className="text-xs text-gray-500 line-clamp-2">{renderTemplate(selectedTemplate?.body, c)}</p>
                                    </div>
                                ))}
                                {recipients.length > 3 && (
                                    <p className="text-xs text-gray-400 text-center py-1">+ {recipients.length - 3} outros contatos</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mb-6">
                        Modo simulado: as mensagens serão registradas nos logs, mas não enviadas para WhatsApp.
                    </div>

                    <div className="flex justify-between">
                        <Button variant="secondary" icon={<ChevronLeft size={15} />} onClick={() => setStep(1)}>Voltar</Button>
                        <Button icon={<Send size={15} />} loading={sending} onClick={handleSend}>
                            Enviar {recipients.length} mensagem{recipients.length !== 1 ? 'ns' : ''}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
