import { Loader2 } from 'lucide-react'

const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] shadow-sm',
    secondary: 'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 active:scale-[0.98]',
    ghost: 'text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-sm',
    dangerGhost: 'text-red-500 hover:bg-red-50 active:scale-[0.98]',
}

const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-sm gap-2',
}

export default function Button({ children, variant = 'primary', size = 'md', loading, icon, className = '', ...props }) {
    return (
        <button
            className={`
                inline-flex items-center justify-center font-medium rounded-lg
                transition-all duration-150 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
            {children}
        </button>
    )
}
