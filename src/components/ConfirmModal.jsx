import { memo } from 'react';
import '../styles/ConfirmModal.css';

const ConfirmModal = memo(function ConfirmModal({ isOpen, title, message, confirmLabel, variant, onConfirm, onCancel }) {
    if (!isOpen) return null;

    const variantClass = variant === 'danger' ? 'confirm-btn-danger'
        : variant === 'warning' ? 'confirm-btn-warning'
            : 'confirm-btn-primary';

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{title || 'Confirm Action'}</h3>
                <p className="modal-message">{message || 'Are you sure you want to proceed?'}</p>
                <div className="modal-actions">
                    <button className="modal-btn modal-btn-cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={`modal-btn ${variantClass}`} onClick={onConfirm}>
                        {confirmLabel || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ConfirmModal;
