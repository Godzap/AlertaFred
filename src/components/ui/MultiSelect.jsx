import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'

export default function MultiSelect({ label, options = [], value = [], onChange, placeholder = 'Selecione...' }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const toggle = (id) => {
        if (value.includes(id)) onChange(value.filter(v => v !== id))
        else onChange([...value, id])
    }

    const selected = options.filter(o => value.includes(o.value))

    return (
        <div className="flex flex-col gap-1.5" ref={ref}>
            {label && (
                <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}
            <div
                className="min-h-9 rounded-lg border border-gray-200 bg-white px-3 py-1.5 cursor-pointer flex items-center gap-2 flex-wrap focus-within:ring-2 focus-within:ring-brand-200 focus-within:border-brand-400 transition-all"
                onClick={() => setOpen(v => !v)}
            >
                {selected.length === 0 && <span className="text-sm text-gray-400">{placeholder}</span>}
                {selected.map(opt => (
                    <span
                        key={opt.value}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: opt.color + '22', color: opt.color, border: `1px solid ${opt.color}44` }}
                        onClick={e => { e.stopPropagation(); toggle(opt.value) }}
                    >
                        {opt.label}
                        <X size={10} />
                    </span>
                ))}
                <ChevronDown size={14} className={`ml-auto text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-gray-100 shadow-card-lg overflow-hidden" style={{ position: 'relative' }}>
                    <div className="max-h-48 overflow-y-auto py-1">
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => toggle(opt.value)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: opt.color || '#4a8ad4' }}
                                />
                                <span className="flex-1 text-left">{opt.label}</span>
                                {value.includes(opt.value) && <Check size={14} className="text-brand-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
