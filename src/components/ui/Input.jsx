export default function Input({ label, error, icon, className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-xs font-600 text-gray-600 uppercase tracking-wide" style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)' }}>
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </span>
                )}
                <input
                    className={`
                        w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800
                        placeholder:text-gray-400
                        focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                        transition-all duration-150
                        disabled:bg-gray-50 disabled:text-gray-400
                        ${icon ? 'pl-9' : ''}
                        ${error ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}
