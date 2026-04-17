import Button from './Button'

export default function EmptyState({ icon, title, description, action, actionLabel }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            {icon && (
                <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-400 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-base font-semibold text-gray-700 mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {title}
            </h3>
            {description && <p className="text-sm text-gray-400 text-center max-w-xs mb-6">{description}</p>}
            {action && (
                <Button onClick={action} size="sm">{actionLabel}</Button>
            )}
        </div>
    )
}
