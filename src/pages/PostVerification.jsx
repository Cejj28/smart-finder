import { useState, useCallback, useEffect, useRef } from 'react';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import DetailPanel from '../components/DetailPanel';
import useConfirmModal from '../hooks/useConfirmModal';
import useSearch from '../hooks/useSearch';
import { fetchItems, updateItemStatus, createItem } from '../services/api';
import '../styles/Pages.css';

const EMPTY_FORM = { type: 'Lost', item_name: '', location: '', description: '', contact_info: '' };
const SEARCH_FIELDS = ['item_name', 'reporter', 'location'];

const CONFIRM_ACTIONS = {
    verify: {
        title: 'Verify Post',
        message: 'Are you sure you want to verify this post? It will be marked as verified.',
        confirmLabel: 'Verify',
        variant: 'primary',
    },
    reject: {
        title: 'Reject Post',
        message: 'Are you sure you want to reject this post? This action cannot be undone.',
        confirmLabel: 'Reject',
        variant: 'danger',
    },
    submit: {
        title: 'Confirm Submission',
        message: 'Are you sure you want to submit this post to the system?',
        confirmLabel: 'Submit Post',
        variant: 'primary',
    },
};

function PostVerification() {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchItems();
                setPosts(data);
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, []);

    const { confirm, openConfirm, closeConfirm, confirmProps } = useConfirmModal(CONFIRM_ACTIONS);
    const { searchTerm, setSearchTerm, filtered } = useSearch(posts, SEARCH_FIELDS);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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

    const showFeedback = useCallback((msg) => {
        setFeedback(msg);
        setTimeout(() => setFeedback(''), 4000);
    }, []);

    const resetForm = useCallback(() => {
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!form.item_name.trim() || !form.location.trim()) {
            setFeedback('Item name and location are required.');
            return;
        }
        openConfirm(null, 'submit');
    }, [form, openConfirm]);

    const handleConfirm = useCallback(async () => {
        const { id, action } = confirm;
        try {
            if (action === 'submit') {
                setSubmitting(true);
                const created = await createItem({ ...form, imageFile });
                // Map returned item to match local shape
                const newPost = {
                    id: created.id,
                    type: created.type,
                    item_name: created.item_name,
                    location: created.location,
                    description: created.description,
                    contact_info: created.contact_info,
                    image_url: created.image || null,
                    reporter: 'Admin',
                    date: new Date(created.created_at).toLocaleDateString(),
                    status: created.status || 'Pending Review',
                };
                setPosts(prev => [newPost, ...prev]);
                resetForm();
                showFeedback('Post submitted successfully!');
            } else if (action === 'verify') {
                await updateItemStatus(id, 'Verified');
                setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Verified' } : p));
                setSelectedPost(prev => prev?.id === id ? { ...prev, status: 'Verified' } : prev);
            } else if (action === 'reject') {
                await updateItemStatus(id, 'Rejected');
                setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
                setSelectedPost(prev => prev?.id === id ? { ...prev, status: 'Rejected' } : prev);
            }
        } catch (e) {
            console.error(e);
            showFeedback('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
        closeConfirm();
        if (action !== 'submit') setSelectedPost(null);
    }, [confirm, closeConfirm, form, imageFile, resetForm, showFeedback]);

    const API_BASE = 'http://localhost:8000';

    const detailFields = [
        { label: 'Type', key: 'type', render: (val) => <StatusBadge status={val} /> },
        { label: 'Item Name', key: 'item_name' },
        { label: 'Reported By', key: 'reporter' },
        { label: 'Location', key: 'location' },
        { label: 'Date', key: 'date' },
        { label: 'Description', key: 'description' },
        { label: 'Contact Info', key: 'contact_info' },
        { label: 'Status', key: 'status', render: (val) => <StatusBadge status={val} /> },
        {
            label: 'Photo', key: 'image_url', render: (val) => val
                ? <img src={val.startsWith('http') ? val : `${API_BASE}${val}`} alt="Item" style={{ width: '100%', borderRadius: '8px', marginTop: '4px' }} />
                : <span style={{ color: '#94A3B8' }}>No photo</span>
        },
    ];

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>Post Review &amp; Verification</h1>
                <p>Review user-submitted lost &amp; found posts and verify their accuracy.</p>
            </div>

            {/* Add Post Form */}
            <section className="form-card">
                <h2>Submit New Post</h2>
                {feedback && <div className={`form-feedback ${feedback.includes('success') ? 'success' : 'error'}`}>{feedback}</div>}
                <form onSubmit={handleSubmit} className="page-form">

                    {/* Type selector */}
                    <div className="form-group">
                        <label>Report Type</label>
                        <div className="type-toggle">
                            {['Lost', 'Found'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    className={`type-btn ${t.toLowerCase()} ${form.type === t ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, type: t }))}
                                >
                                    {t === 'Lost' ? '🔍' : '✅'} {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pv-item">Item Name *</label>
                            <input id="pv-item" type="text" name="item_name" value={form.item_name} onChange={handleChange} placeholder="e.g. Blue Backpack" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pv-location">Location *</label>
                            <input id="pv-location" type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Library 2nd Floor" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pv-desc">Description</label>
                        <textarea id="pv-desc" name="description" value={form.description} onChange={handleChange} placeholder="Describe the item in detail..." rows="3" />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pv-contact">Contact Info</label>
                            <input id="pv-contact" type="text" name="contact_info" value={form.contact_info} onChange={handleChange} placeholder="Phone or email" />
                        </div>
                        <div className="form-group">
                            <label>Item Photo</label>
                            {imagePreview ? (
                                <div className="image-preview-wrap">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button type="button" className="btn-remove-image" onClick={handleRemoveImage}>✕ Remove</button>
                                </div>
                            ) : (
                                <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
                                    <span>📷 Click to upload photo</span>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting…' : 'Submit Post'}
                        </button>
                    </div>
                </form>
            </section>

            {/* Posts Table */}
            <section className="table-card">
                <div className="search-header">
                    <h2>All Posts ({filtered.length})</h2>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Item Name</th>
                                <th>Reporter</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="clickable-row" onClick={() => setSelectedPost(p)}>
                                    <td><StatusBadge status={p.type} /></td>
                                    <td>{p.item_name}</td>
                                    <td>{p.reporter}</td>
                                    <td>{p.location}</td>
                                    <td className="date-cell">{p.date}</td>
                                    <td><StatusBadge status={p.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p className="empty-state">No posts found.</p>}
                </div>
            </section>

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
                title="Post Details"
                data={selectedPost || {}}
                fields={detailFields}
                actions={
                    selectedPost?.status?.includes('Pending') ? (
                        <>
                            <button className="btn-danger" onClick={() => openConfirm(selectedPost.id, 'reject')}>Reject</button>
                            <button className="btn-primary" onClick={() => openConfirm(selectedPost.id, 'verify')}>Verify</button>
                        </>
                    ) : null
                }
            />
        </main>
    );
}

export default PostVerification;
