export default function Textarea({ label, error, className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                    {label}
                </label>
            )}
            <textarea
                className={`
                    w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800
                    placeholder:text-gray-400 resize-none
                    focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400
                    transition-all duration-150
                    ${error ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : ''}
                    ${className}
                `}
                rows={4}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}
