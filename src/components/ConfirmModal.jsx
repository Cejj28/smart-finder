import { memo, useState } from 'react';
import '../styles/ConfirmModal.css';

const ConfirmModal = memo(function ConfirmModal({ isOpen, title, message, confirmLabel, variant, onConfirm, onCancel }) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const variantClass = variant === 'danger' ? 'confirm-btn-danger'
        : variant === 'warning' ? 'confirm-btn-warning'
            : 'confirm-btn-primary';

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={!isLoading ? onCancel : undefined}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{title || 'Confirm Action'}</h3>
                <p className="modal-message">{message || 'Are you sure you want to proceed?'}</p>
                <div className="modal-actions">
                    <button className="modal-btn modal-btn-cancel" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </button>
                    <button className={`modal-btn ${variantClass}`} onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? 'Processing...' : (confirmLabel || 'Confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ConfirmModal;
