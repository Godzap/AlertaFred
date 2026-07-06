import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function SlideOver({ open, onClose, title, subtitle, children }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [open])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md h-screen bg-white shadow-card-lg animate-slide-in-right flex flex-col">
                <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            {title}
                        </h2>
                        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}
