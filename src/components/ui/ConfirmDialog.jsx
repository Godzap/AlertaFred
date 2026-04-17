import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', loading }) {
    return (
        <Modal open={open} onClose={onClose} title={title} size="sm">
            <div className="px-6 py-5">
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button variant="danger" onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
                </div>
            </div>
        </Modal>
    )
}
