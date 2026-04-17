import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, total, perPage = 20, onChange }) {
    const pages = Math.ceil(total / perPage)
    if (pages <= 1) return null

    const from = (page - 1) * perPage + 1
    const to = Math.min(page * perPage, total)

    return (
        <div className="flex items-center justify-between px-1 py-3">
            <span className="text-xs text-gray-400">
                {from}–{to} de {total}
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={15} />
                </button>
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                    let p = i + 1
                    if (pages > 5 && page > 3) p = page - 2 + i
                    if (p > pages) return null
                    return (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                                p === page
                                    ? 'bg-brand-600 text-white font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {p}
                        </button>
                    )
                })}
                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === pages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={15} />
                </button>
            </div>
        </div>
    )
}
