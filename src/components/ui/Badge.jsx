const variants = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    inactive: 'bg-gray-100 text-gray-500 border border-gray-200',
    blocked: 'bg-red-50 text-red-600 border border-red-200',
    simulated: 'bg-blue-50 text-blue-600 border border-blue-200',
    sent: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    failed: 'bg-red-50 text-red-600 border border-red-200',
    paused: 'bg-amber-50 text-amber-700 border border-amber-200',
    completed: 'bg-gray-100 text-gray-500 border border-gray-200',
    default: 'bg-brand-50 text-brand-700 border border-brand-200',
}

const labels = {
    active: 'Ativo',
    inactive: 'Inativo',
    blocked: 'Bloqueado',
    simulated: 'Simulado',
    sent: 'Enviado',
    failed: 'Falhou',
    paused: 'Pausado',
    completed: 'Concluído',
    manual: 'Manual',
    form: 'Formulário',
    import: 'Importado',
    text: 'Texto',
    text_link: 'Link',
    text_image: 'Imagem',
}

export default function Badge({ children, status, color, className = '' }) {
    const style = status ? (variants[status] || variants.default) : null

    if (color) {
        return (
            <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
                style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
            >
                {children}
            </span>
        )
    }

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style || variants.default} ${className}`}>
            {status ? (labels[status] || children) : children}
        </span>
    )
}
