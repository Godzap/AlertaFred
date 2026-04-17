import { ChevronDown } from 'lucide-react'

export default function Select({ label, error, options = [], placeholder = 'Selecione...', className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`
                        w-full h-9 rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                        transition-all duration-150 appearance-none cursor-pointer
                        disabled:bg-gray-50 disabled:text-gray-400
                        ${error ? 'border-red-400' : ''}
                        ${className}
                    `}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}
