import { useState, useEffect, useCallback } from 'react';
import '../styles/DetailPanel.css';

const DetailPanel = ({ isOpen, onClose, title, data, fields, actions }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            // Prevent body scroll when panel is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 280);
    }, [onClose]);

    if (!isOpen && !isClosing) return null;

    return (
        <div className={`panel-backdrop ${isClosing ? 'backdrop-closing' : ''}`} onClick={handleClose}>
            <div 
                className={`detail-panel ${isClosing ? 'detail-panel-closing' : ''}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <header className="panel-header">
                    <h2>{title}</h2>
                    <button className="btn-close" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </header>

                <div className="panel-content">
                    <div className="detail-grid">
                        {fields.map((field, idx) => (
                            <div className="detail-row" key={idx}>
                                <span className="detail-label">{field.label}</span>
                                <span className="detail-value">
                                    {field.render ? field.render(data[field.key], data) : (data[field.key] || '—')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {actions && (
                    <footer className="panel-actions">
                        {actions}
                    </footer>
                )}
            </div>
        </div>
    );
};

export default DetailPanel;
