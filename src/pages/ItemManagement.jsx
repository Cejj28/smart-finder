import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import DetailPanel from '../components/DetailPanel';
import useConfirmModal from '../hooks/useConfirmModal';
import useSearch from '../hooks/useSearch';
import { fetchItems, updateItemStatus, createItem, predictCategory } from '../services/api';
import '../styles/App.css';
import '../styles/Pages.css';

const SEARCH_FIELDS = ['item_name', 'location', 'reporter'];

const EMPTY_FORM = {
    type: 'Found',
    item_name: '',
    location: '',
    description: '',
    contact_info: '',
};

const CONFIRM_ACTIONS = {
    approve: {
        title: 'Approve Post',
        message: 'Are you sure you want to approve this post? It will be visible on the public mobile feed.',
        confirmLabel: 'Approve',
        variant: 'primary',
    },
    reject: {
        title: 'Reject Post',
        message: 'Are you sure you want to reject this post? This will hide it from the mobile feed.',
        confirmLabel: 'Reject',
        variant: 'danger',
    },
};

const STATUS_FILTERS = ['All', 'Pending Review', 'Approved', 'Rejected'];

function ItemManagement() {
    const [posts, setPosts] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);

    // Form State
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);

    const fileInputRef = useRef(null);
    const predictionTimer = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchItems();
                setPosts(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const { confirm, openConfirm, closeConfirm, confirmProps } = useConfirmModal(CONFIRM_ACTIONS);
    const [selectedPost, setSelectedPost] = useState(null);

    // Form Logic
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => {
            const nextForm = { ...prev, [name]: value };
            if (name === 'item_name' || name === 'description') {
                if (predictionTimer.current) clearTimeout(predictionTimer.current);
                if (!nextForm.item_name.trim()) {
                    setPrediction(null);
                    return nextForm;
                }
                setIsPredicting(true);
                predictionTimer.current = setTimeout(async () => {
                    try {
                        const result = await predictCategory(nextForm.item_name, nextForm.description);
                        setPrediction(result);
                    } catch (e) {
                        console.error('Prediction failed:', e);
                    } finally {
                        setIsPredicting(false);
                    }
                }, 800);
            }
            return nextForm;
        });
    }, []);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }, []);

    const handleRemoveImage = useCallback(() => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const resetForm = useCallback(() => {
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview(null);
        setPrediction(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.item_name.trim() || !form.location.trim()) {
            setFeedback('Item name and location are required.');
            return;
        }
        openConfirm(null, 'submit');
    };

    const handleConfirm = useCallback(async () => {
        const { id, action } = confirm;
        try {
            if (action === 'submit') {
                setSubmitting(true);
                const created = await createItem({ ...form, category: prediction?.category || '', imageFile });

                // Add to list immediately
                const newPost = {
                    id: created.id,
                    type: created.type,
                    item_name: created.item_name,
                    location: created.location,
                    description: created.description,
                    contact_info: created.contact_info,
                    category: created.category,
                    image_url: created.image || null,
                    reporter: 'Admin',
                    date: new Date(created.created_at).toLocaleDateString(),
                    status: created.status || 'Pending Review',
                };

                setPosts(prev => [newPost, ...prev]);
                resetForm();
                setFeedback('Post submitted successfully!');
                setTimeout(() => setFeedback(''), 3000);
            } else {
                const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
                await updateItemStatus(id, newStatus);
                setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
                if (selectedPost?.id === id) setSelectedPost(prev => ({ ...prev, status: newStatus }));
                setFeedback(`Successfully ${newStatus.toLowerCase()}!`);
                setTimeout(() => setFeedback(''), 3000);
            }
        } catch (e) {
            console.error(e);
            setFeedback('Action failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
        closeConfirm();
    }, [confirm, closeConfirm, selectedPost, form, imageFile, prediction, resetForm]);

    // Apply Status Filter first
    const itemsByStatus = useMemo(() => {
        if (statusFilter === 'All') return posts;
        return posts.filter(p => p.status === statusFilter);
    }, [posts, statusFilter]);

    // Then apply Search
    const { searchTerm, setSearchTerm, filtered } = useSearch(itemsByStatus, SEARCH_FIELDS);

    const detailFields = [
        { label: 'Type', key: 'type', render: (val) => <StatusBadge status={val} /> },
        { label: 'Item Name', key: 'item_name' },
        { 
            label: 'AI Category', 
            key: 'category', 
            render: (val) => val ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    🤖 <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontWeight: '600', border: '1px solid #e2e8f0' }}>{val}</span>
                </span>
            ) : null 
        },
        { label: 'Reported By', key: 'reporter' },
        { label: 'Location', key: 'location' },
        { label: 'Date', key: 'date' },
        { label: 'Description', key: 'description' },
        { label: 'Contact Info', key: 'contact_info' },
        { label: 'Status', key: 'status', render: (val) => <StatusBadge status={val} /> },
        {
            label: 'Photo', key: 'image_url', render: (val) => val
                ? <img src={val} alt="Item" style={{ width: '100%', borderRadius: '8px', marginTop: '4px' }} />
                : <span style={{ color: '#94A3B8' }}>No photo</span>
        },
    ];

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>Item Management</h1>
                <p>Manage and verify all lost & found items in the system.</p>
            </div>

            {/* Add Post Form - RESTORED */}
            {/* Add Post Form - PREMIUM REDESIGN */}
            <section className="form-card" style={{
                marginBottom: '3rem',
                padding: '30px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>📝</span>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Submit New Post
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="page-form">
                    {/* Type selector */}
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ fontWeight: '700', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Report Type</label>
                        <div className="type-toggle" style={{ display: 'flex', gap: '15px', marginTop: '12px' }}>
                            {['Lost', 'Found'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    className={`type-btn ${t.toLowerCase()} ${form.type === t ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, type: t }))}
                                    style={{
                                        flex: '1',
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: form.type === t ? (t === 'Lost' ? '2px solid #ef4444' : '2px solid #22c55e') : '2px solid #e2e8f0',
                                        background: form.type === t ? (t === 'Lost' ? '#fef2f2' : '#f0fdf4') : '#fff',
                                        color: form.type === t ? (t === 'Lost' ? '#b91c1c' : '#15803d') : '#64748b',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: form.type === t ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem' }}>{t === 'Lost' ? '🔍' : '✅'}</span> {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '2rem' }}>
                        <div className="form-group">
                            <label htmlFor="pv-item" style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Item Name *</label>
                            <input
                                id="pv-item"
                                type="text"
                                name="item_name"
                                value={form.item_name}
                                onChange={handleChange}
                                placeholder="e.g. Blue Backpack"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e2e8f0',
                                    marginTop: '8px',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s',
                                    outline: 'none',
                                    background: '#fff'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pv-location" style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Location *</label>
                            <input
                                id="pv-location"
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="e.g. Library 2nd Floor"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    borderRadius: '12px',
                                    border: '2px solid #e2e8f0',
                                    marginTop: '8px',
                                    fontSize: '1rem',
                                    transition: 'border-color 0.2s',
                                    outline: 'none',
                                    background: '#fff'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label htmlFor="pv-desc" style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Detailed Description</label>
                        <textarea
                            id="pv-desc"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the item (color, brand, unique marks)..."
                            rows="3"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                border: '2px solid #e2e8f0',
                                marginTop: '8px',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none',
                                background: '#fff',
                                resize: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />

                        {/* AI Prediction Badge - REFINED */}
                        {(prediction || isPredicting) && (
                            <div className="ai-prediction-badge" style={{
                                marginTop: '12px',
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}>
                                <span style={{ fontSize: '1.4rem' }}>🤖</span>
                                {isPredicting ? (
                                    <span style={{ fontStyle: 'italic', color: '#64748b' }}>AI is analyzing your description...</span>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontWeight: '600', color: '#475569' }}>AI Categorized as:</span>
                                        <span style={{
                                            background: 'var(--primary-color)',
                                            color: 'white',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontWeight: '700',
                                            fontSize: '0.85rem',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {prediction.category}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label htmlFor="pv-contact" style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Contact Info</label>
                        <input
                            id="pv-contact"
                            type="text"
                            name="contact_info"
                            value={form.contact_info}
                            onChange={handleChange}
                            placeholder="e.g. 0912-345-6789"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                border: '2px solid #e2e8f0',
                                marginTop: '8px',
                                fontSize: '1rem',
                                transition: 'border-color 0.2s',
                                outline: 'none',
                                background: '#fff'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                        <label style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Photo Attachment</label>
                        <div className="image-upload-container" style={{ marginTop: '12px' }}>
                            {imagePreview ? (
                                <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '15px', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'rgba(239, 68, 68, 0.9)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        width: '160px',
                                        height: '160px',
                                        border: '3px dashed #e2e8f0',
                                        borderRadius: '15px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        background: '#f8fafc',
                                        transition: 'all 0.2s',
                                        gap: '8px'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.background = '#f1f5f9'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                                >
                                    <span style={{ fontSize: '2.5rem' }}>📸</span>
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Upload Photo</span>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, #1d4ed8 100%)',
                                color: 'white',
                                fontWeight: '800',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 20px -3px rgba(37, 99, 235, 0.4)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)'; }}
                        >
                            {submitting ? '🚀 Submitting...' : 'Confirm and Post Item'}
                        </button>
                    </div>
                </form>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '2.5rem' }} />

            {/* Filter and Search Bar */}
            <div className="item-filters-bar" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <div className="status-tabs" style={{ display: 'flex', gap: '10px' }}>
                    {STATUS_FILTERS.map(status => (
                        <button
                            key={status}
                            className={`tab-btn ${statusFilter === status ? 'active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                cursor: 'pointer',
                                background: statusFilter === status ? 'var(--primary-color)' : 'var(--card-bg)',
                                color: statusFilter === status ? 'white' : 'var(--text-secondary)',
                                fontWeight: '600',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="search-wrap" style={{ flex: '1', maxWidth: '400px' }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search items, locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', marginBottom: '0' }}
                    />
                </div>
            </div>

            {/* Floating Feedback Notification */}
            {feedback && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: '1000',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    background: feedback.includes('success') ? '#DCFCE7' : '#FEE2E2',
                    color: feedback.includes('success') ? '#166534' : '#991B1B',
                    border: feedback.includes('success') ? '2px solid #22c55e' : '2px solid #ef4444',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: '700',
                    animation: 'slideIn 0.3s ease-out forwards'
                }}>
                    <span style={{ fontSize: '1.2rem' }}>{feedback.includes('success') ? '✅' : '⚠️'}</span>
                    {feedback}
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>

            {/* Visual Feed Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading items...</div>
            ) : (
                <div className="item-feed-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '25px'
                }}>
                    {filtered.map(item => (
                        <div
                            key={item.id}
                            className="item-card"
                            onClick={() => setSelectedPost(item)}
                            style={{
                                background: 'var(--card-bg)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-md)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: '1px solid var(--border-color)',
                                position: 'relative'
                            }}
                        >
                            {/* Type Badge Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                zIndex: '2'
                            }}>
                                <StatusBadge status={item.type} />
                            </div>

                            {/* Status Badge Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                zIndex: '2'
                            }}>
                                <StatusBadge status={item.status} />
                            </div>

                            {/* Image Container */}
                            <div style={{
                                width: '100%',
                                height: '200px',
                                background: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.item_name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span style={{ fontSize: '3rem' }}>📦</span>
                                )}
                            </div>

                            {/* Info Container */}
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: '700' }}>{item.item_name}</h3>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    📍 {item.location}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    borderTop: '1px solid var(--border-color)',
                                    paddingTop: '10px'
                                }}>
                                    <span>👤 {item.reporter}</span>
                                    <span>📅 {item.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
                    <p>No items found matching your filters.</p>
                </div>
            )}

            <ConfirmModal
                isOpen={confirm.open}
                title={confirmProps.title}
                message={confirmProps.message}
                confirmLabel={confirmProps.confirmLabel}
                variant={confirmProps.variant}
                onConfirm={handleConfirm}
                onCancel={closeConfirm}
            />

            <DetailPanel
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                title="Item Details"
                data={selectedPost || {}}
                fields={detailFields.filter(f => {
                    const val = (selectedPost || {})[f.key];
                    if (f.key === 'category' && !val) return false;
                    return true;
                })}
                actions={
                    selectedPost?.status === 'Pending Review' ? (
                        <>
                            <button className="btn-danger" onClick={() => openConfirm(selectedPost.id, 'reject')}>Reject</button>
                            <button className="btn-primary" onClick={() => openConfirm(selectedPost.id, 'approve')}>Approve</button>
                        </>
                    ) : (
                        <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            Post is already {selectedPost?.status.toLowerCase()}.
                        </div>
                    )
                }
            />
        </main>
    );
}

export default ItemManagement;
