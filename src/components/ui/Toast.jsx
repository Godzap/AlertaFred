import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const icons = {
    success: <CheckCircle size={16} className="text-emerald-500" />,
    error: <XCircle size={16} className="text-red-500" />,
    warning: <AlertCircle size={16} className="text-amber-500" />,
    info: <Info size={16} className="text-blue-500" />,
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    }, [])

    const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className="animate-slide-in-right pointer-events-auto flex items-center gap-3 bg-white rounded-xl shadow-card-lg border border-gray-100 px-4 py-3 min-w-[280px] max-w-sm"
                    >
                        {icons[t.type]}
                        <span className="text-sm text-gray-700 flex-1">{t.message}</span>
                        <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}
