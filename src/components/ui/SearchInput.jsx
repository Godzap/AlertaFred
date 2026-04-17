import { Search, X } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Buscar...', className = '' }) {
    return (
        <div className={`relative ${className}`}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-8 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={12} />
                </button>
            )}
        </div>
    )
}
