import { useState, useEffect, useCallback } from 'react';
import { predictCategory } from '../services/api';
import '../styles/DetailPanel.css';

const DetailPanel = ({ isOpen, onClose, title, data, fields, actions }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [matches, setMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            // Prevent body scroll when panel is open
            document.body.style.overflow = 'hidden';
            
            // Only trigger AI Prediction if category is missing
            if (!data?.category && data?.item_name) {
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

            // Fetch Matches if item has a category
            if ((data?.category || prediction?.category) && data?.id) {
                const fetchMatches = async () => {
                    setLoadingMatches(true);
                    try {
                        // We need an endpoint for matches in the web api too!
                        const response = await fetch(`${window.location.origin.replace('3000', '8000')}/api/items/${data.id}/matches/`, {
                            headers: { 'Authorization': `Token ${localStorage.getItem('sf_token')}` }
                        });
                        if (response.ok) {
                            const result = await response.json();
                            setMatches(result);
                        }
                    } catch (e) {
                        console.error('Failed to fetch matches', e);
                    } finally {
                        setLoadingMatches(false);
                    }
                };
                fetchMatches();
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
                    {(data?.category || prediction || isPredicting) && (
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
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 6px 0', color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                                    {data?.category ? 'Item Category (AI Verified)' : 'AI Category Analysis'}
                                </h4>
                                {isPredicting ? (
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analyzing item...</p>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                                {data?.category ? 'Category:' : 'Suggested:'}
                                            </span>
                                            <span style={{
                                                background: 'var(--primary-color)',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600'
                                            }}>{data?.category || prediction?.category}</span>
                                            {prediction && (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    ({Math.round(prediction.confidence * 100)}% confidence)
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                                
                                {/* Smart Matches UI */}
                                {matches.length > 0 && (
                                    <div style={{ marginTop: '12px', borderTop: '1px dashed rgba(99, 102, 241, 0.3)', paddingTop: '12px' }}>
                                        <h5 style={{ margin: '0 0 8px 0', color: 'var(--success-color)', fontSize: '0.85rem' }}>
                                            ✨ Smart Matches Found ({matches.length})
                                        </h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {matches.map(match => (
                                                <div key={match.id} style={{ 
                                                    background: 'white', 
                                                    padding: '8px', 
                                                    borderRadius: '8px', 
                                                    fontSize: '0.8rem',
                                                    border: '1px solid #E2E8F0',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span>{match.item_name} at {match.location}</span>
                                                    <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>View</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
