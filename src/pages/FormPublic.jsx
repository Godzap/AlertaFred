import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Zap, Check, Loader2 } from 'lucide-react'
import { useForms } from '../hooks/useForms'

function FieldInput({ field, value, onChange }) {
    const base = "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all"

    if (field.type === 'textarea') {
        return (
            <textarea
                value={value || ''}
                onChange={e => onChange(field.name, e.target.value)}
                placeholder={field.label}
                rows={3}
                required={field.required}
                className={`${base} h-auto py-3 resize-none`}
            />
        )
    }

    if (['select', 'multiselect'].includes(field.type)) {
        return (
            <select
                value={value || ''}
                onChange={e => onChange(field.name, e.target.value)}
                required={field.required}
                className={`${base} appearance-none`}
            >
                <option value="">Selecione...</option>
                {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        )
    }

    return (
        <input
            type={field.type === 'phone' ? 'tel' : field.type}
            value={value || ''}
            onChange={e => onChange(field.name, e.target.value)}
            placeholder={field.type === 'phone' ? '+55 11 99999-9999' : field.label}
            required={field.required}
            className={base}
        />
    )
}

export default function FormPublic() {
    const { slug } = useParams()
    const { getFormBySlug } = useForms()
    const [formData, setFormData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [values, setValues] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        getFormBySlug(slug).then(f => {
            if (!f) setNotFound(true)
            else setFormData(f)
            setLoading(false)
        })
    }, [slug])

    const setValue = (name, val) => setValues(v => ({ ...v, [name]: val }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        await new Promise(r => setTimeout(r, 1000))
        setSubmitted(true)
        setSubmitting(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-brand-400" />
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #eef4fb 0%, #ffffff 60%)' }}>
                <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-4">
                    <Zap size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Formulário não encontrado</h1>
                <p className="text-sm text-gray-500">Este formulário não existe ou está inativo.</p>
            </div>
        )
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #eef4fb 0%, #ffffff 60%)' }}>
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-scale-in">
                    <Check size={40} className="text-emerald-500" strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Enviado com sucesso!</h1>
                <p className="text-sm text-gray-500 text-center max-w-xs">{formData?.confirmation_message}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #eef4fb 0%, #ffffff 60%)' }}>
            <div className="w-full max-w-[480px]">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
                        <Zap size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="text-gray-600 text-sm font-medium" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>ZapCRM</span>
                </div>

                <div className="bg-white rounded-2xl shadow-card-lg border border-gray-100 overflow-hidden">
                    <div className="bg-brand-600 px-6 py-5">
                        <h1 className="text-xl font-bold text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            {formData?.title}
                        </h1>
                        {formData?.description && <p className="text-sm text-white/80 mt-1">{formData.description}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                        {formData?.fields?.map(f => (
                            <div key={f.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {f.label} {f.required && <span className="text-red-500">*</span>}
                                </label>
                                <FieldInput field={f} value={values[f.name]} onChange={setValue} />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-11 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            Enviar
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">Powered by ZapCRM</p>
            </div>
        </div>
    )
}
