import { useState, useEffect, useCallback } from 'react';
import { predictCategory } from '../services/api';
import '../styles/DetailPanel.css';

const DetailPanel = ({ isOpen, onClose, title, data, fields, actions }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            // Prevent body scroll when panel is open
            document.body.style.overflow = 'hidden';
            
            // Trigger AI Prediction when panel opens
            if (data?.item_name) {
                const fetchPrediction = async () => {
                    setIsPredicting(true);
                    setPrediction(null);
                    try {
                        const result = await predictCategory(data.item_name, data.description || '');
                        setPrediction(result);
                    } catch (e) {
                        console.error('Failed to get ML prediction', e);
                    } finally {
                        setIsPredicting(false);
                    }
                };
                fetchPrediction();
            }
        } else {
            document.body.style.overflow = 'auto';
            setPrediction(null);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, data]);

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
                    
                    {/* AI Analysis Section */}
                    {(prediction || isPredicting) && (
                        <div className="ai-analysis-card" style={{
                            background: 'rgba(99, 102, 241, 0.05)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '24px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                        }}>
                            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🤖</span>
                            <div>
                                <h4 style={{ margin: '0 0 6px 0', color: 'var(--primary-color)', fontSize: '0.95rem' }}>AI Category Analysis</h4>
                                {isPredicting ? (
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analyzing item...</p>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Suggested:</span>
                                            <span style={{
                                                background: 'var(--primary-color)',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600'
                                            }}>{prediction.category}</span>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                ({Math.round(prediction.confidence * 100)}% match)
                                            </span>
                                        </div>
                                        {/* Show top alternative if confidence < 90% */}
                                        {prediction.confidence < 0.9 && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                Alternative: {
                                                    Object.entries(prediction.all_scores)
                                                        .filter(([cat]) => cat !== prediction.category)
                                                        .sort(([, a], [, b]) => b - a)[0][0]
                                                } ({Math.round(Object.entries(prediction.all_scores)
                                                        .filter(([cat]) => cat !== prediction.category)
                                                        .sort(([, a], [, b]) => b - a)[0][1] * 100)}%)
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

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
