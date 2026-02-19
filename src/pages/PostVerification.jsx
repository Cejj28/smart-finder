import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { pendingPosts as initialPosts } from '../data/mockData';
import '../styles/Pages.css';

const emptyForm = { type: 'Lost', item: '', location: '', reporter: '', date: '', description: '' };

function PostVerification() {
    const [posts, setPosts] = useState(initialPosts);
    const [form, setForm] = useState(emptyForm);
    const [searchTerm, setSearchTerm] = useState('');
    const [feedback, setFeedback] = useState('');
    const [confirm, setConfirm] = useState({ open: false, id: null, action: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.item || !form.location || !form.reporter || !form.date) {
            setFeedback('Please fill in all required fields.');
            return;
        }
        const newPost = {
            id: Date.now(),
            ...form,
            status: 'Pending',
        };
        setPosts([newPost, ...posts]);
        setForm(emptyForm);
        setFeedback('Post added successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleConfirm = () => {
        const { id, action } = confirm;
        if (action === 'verify') {
            setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Verified' } : p));
        } else if (action === 'reject') {
            setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
        }
        setConfirm({ open: false, id: null, action: '' });
    };

    const filtered = posts.filter(p =>
        p.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>Post Review & Verification</h1>
                <p>Review user-submitted lost & found posts and verify their accuracy.</p>
            </div>

            {/* Add Post Form */}
            <section className="form-card">
                <h2>Add New Post</h2>
                {feedback && <div className={`form-feedback ${feedback.includes('success') ? 'success' : 'error'}`}>{feedback}</div>}
                <form onSubmit={handleSubmit} className="page-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pv-type">Type *</label>
                            <select id="pv-type" name="type" value={form.type} onChange={handleChange}>
                                <option value="Lost">Lost</option>
                                <option value="Found">Found</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pv-item">Item Name *</label>
                            <input id="pv-item" type="text" name="item" value={form.item} onChange={handleChange} placeholder="e.g. iPhone 13" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pv-location">Location *</label>
                            <input id="pv-location" type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Library 2F" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pv-reporter">Reported By *</label>
                            <input id="pv-reporter" type="text" name="reporter" value={form.reporter} onChange={handleChange} placeholder="e.g. Juan Dela Cruz" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pv-date">Date *</label>
                            <input id="pv-date" type="date" name="date" value={form.date} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pv-desc">Description</label>
                            <input id="pv-desc" type="text" name="description" value={form.description} onChange={handleChange} placeholder="Brief description..." />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">Submit Post</button>
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
                                <th>Item</th>
                                <th>Reporter</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id}>
                                    <td><StatusBadge status={p.type} /></td>
                                    <td>{p.item}</td>
                                    <td>{p.reporter}</td>
                                    <td>{p.location}</td>
                                    <td className="date-cell">{p.date}</td>
                                    <td>{p.description}</td>
                                    <td><StatusBadge status={p.status} /></td>
                                    <td>
                                        {p.status === 'Pending' ? (
                                            <>
                                                <button className="btn-approve" onClick={() => setConfirm({ open: true, id: p.id, action: 'verify' })}>Verify</button>
                                                <button className="btn-reject" onClick={() => setConfirm({ open: true, id: p.id, action: 'reject' })}>Reject</button>
                                            </>
                                        ) : (
                                            <span className="action-done">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p className="empty-state">No posts found.</p>}
                </div>
            </section>

            <ConfirmModal
                isOpen={confirm.open}
                title={confirm.action === 'verify' ? 'Verify Post' : 'Reject Post'}
                message={confirm.action === 'verify'
                    ? 'Are you sure you want to verify this post? It will be marked as verified.'
                    : 'Are you sure you want to reject this post? This action cannot be undone.'}
                confirmLabel={confirm.action === 'verify' ? 'Verify' : 'Reject'}
                variant={confirm.action === 'verify' ? 'primary' : 'danger'}
                onConfirm={handleConfirm}
                onCancel={() => setConfirm({ open: false, id: null, action: '' })}
            />
        </main>
    );
}

export default PostVerification;
