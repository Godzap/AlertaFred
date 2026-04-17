import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
    const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            {/* Content */}
            <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-card-lg animate-scale-in flex flex-col max-h-[90vh]`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <h2 className="text-base font-semibold text-gray-800" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
                {/* Body */}
                <div className="overflow-y-auto flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}
