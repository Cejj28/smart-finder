import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { claimsData as initialClaims } from '../data/mockData';
import '../styles/Pages.css';

const emptyForm = { claimant: '', item: '', proof: '', contact: '', date: '' };

function ClaimValidation() {
    const [claims, setClaims] = useState(initialClaims);
    const [form, setForm] = useState(emptyForm);
    const [searchTerm, setSearchTerm] = useState('');
    const [feedback, setFeedback] = useState('');
    const [confirm, setConfirm] = useState({ open: false, id: null, action: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.claimant || !form.item || !form.proof || !form.contact || !form.date) {
            setFeedback('Please fill in all required fields.');
            return;
        }
        const newClaim = {
            id: Date.now(),
            ...form,
            status: 'Pending',
            releaseDate: '',
        };
        setClaims([newClaim, ...claims]);
        setForm(emptyForm);
        setFeedback('Claim logged successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleConfirm = () => {
        const { id, action } = confirm;
        if (action === 'approve') {
            setClaims(prev => prev.map(c =>
                c.id === id ? { ...c, status: 'Approved', releaseDate: new Date().toISOString().split('T')[0] } : c
            ));
        } else if (action === 'reject') {
            setClaims(prev => prev.map(c =>
                c.id === id ? { ...c, status: 'Rejected' } : c
            ));
        } else if (action === 'release') {
            setClaims(prev => prev.map(c =>
                c.id === id ? { ...c, status: 'Released' } : c
            ));
        }
        setConfirm({ open: false, id: null, action: '' });
    };

    const getConfirmProps = () => {
        switch (confirm.action) {
            case 'approve':
                return { title: 'Approve Claim', message: 'Are you sure you want to approve this claim? The item will be marked for release.', confirmLabel: 'Approve', variant: 'primary' };
            case 'reject':
                return { title: 'Reject Claim', message: 'Are you sure you want to reject this claim? This action cannot be undone.', confirmLabel: 'Reject', variant: 'danger' };
            case 'release':
                return { title: 'Release Item', message: 'Are you sure the item has been released to the claimant?', confirmLabel: 'Release', variant: 'warning' };
            default:
                return {};
        }
    };

    const filtered = claims.filter(c =>
        c.claimant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmProps = getConfirmProps();

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>Claim Validation & Release Tracking</h1>
                <p>Validate item claims, approve ownership, and track item release.</p>
            </div>

            {/* Summary Stats */}
            <div className="mini-stats">
                <div className="mini-stat">
                    <span className="mini-stat-count">{claims.filter(c => c.status === 'Pending').length}</span>
                    <span className="mini-stat-label">Pending</span>
                </div>
                <div className="mini-stat">
                    <span className="mini-stat-count">{claims.filter(c => c.status === 'Approved').length}</span>
                    <span className="mini-stat-label">Approved</span>
                </div>
                <div className="mini-stat">
                    <span className="mini-stat-count">{claims.filter(c => c.status === 'Released').length}</span>
                    <span className="mini-stat-label">Released</span>
                </div>
                <div className="mini-stat">
                    <span className="mini-stat-count">{claims.filter(c => c.status === 'Rejected').length}</span>
                    <span className="mini-stat-label">Rejected</span>
                </div>
            </div>

            {/* Claim Form */}
            <section className="form-card">
                <h2>Log New Claim</h2>
                {feedback && <div className={`form-feedback ${feedback.includes('success') ? 'success' : 'error'}`}>{feedback}</div>}
                <form onSubmit={handleSubmit} className="page-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cv-claimant">Claimant Name *</label>
                            <input id="cv-claimant" type="text" name="claimant" value={form.claimant} onChange={handleChange} placeholder="Full name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cv-item">Item Being Claimed *</label>
                            <input id="cv-item" type="text" name="item" value={form.item} onChange={handleChange} placeholder="e.g. Black Wallet" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cv-proof">Proof of Ownership *</label>
                            <input id="cv-proof" type="text" name="proof" value={form.proof} onChange={handleChange} placeholder="Describe proof..." />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cv-contact">Contact Info *</label>
                            <input id="cv-contact" type="text" name="contact" value={form.contact} onChange={handleChange} placeholder="Phone or email" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cv-date">Claim Date *</label>
                            <input id="cv-date" type="date" name="date" value={form.date} onChange={handleChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary">Submit Claim</button>
                </form>
            </section>

            {/* Claims Table */}
            <section className="table-card">
                <div className="search-header">
                    <h2>All Claims ({filtered.length})</h2>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search claims..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Claimant</th>
                                <th>Item</th>
                                <th>Proof</th>
                                <th>Contact</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Release Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}>
                                    <td>{c.claimant}</td>
                                    <td>{c.item}</td>
                                    <td>{c.proof}</td>
                                    <td>{c.contact}</td>
                                    <td className="date-cell">{c.date}</td>
                                    <td><StatusBadge status={c.status} /></td>
                                    <td className="date-cell">{c.releaseDate || '—'}</td>
                                    <td>
                                        {c.status === 'Pending' && (
                                            <>
                                                <button className="btn-approve" onClick={() => setConfirm({ open: true, id: c.id, action: 'approve' })}>Approve</button>
                                                <button className="btn-reject" onClick={() => setConfirm({ open: true, id: c.id, action: 'reject' })}>Reject</button>
                                            </>
                                        )}
                                        {c.status === 'Approved' && (
                                            <button className="btn-release" onClick={() => setConfirm({ open: true, id: c.id, action: 'release' })}>Release</button>
                                        )}
                                        {(c.status === 'Released' || c.status === 'Rejected') && (
                                            <span className="action-done">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p className="empty-state">No claims found.</p>}
                </div>
            </section>

            <ConfirmModal
                isOpen={confirm.open}
                title={confirmProps.title}
                message={confirmProps.message}
                confirmLabel={confirmProps.confirmLabel}
                variant={confirmProps.variant}
                onConfirm={handleConfirm}
                onCancel={() => setConfirm({ open: false, id: null, action: '' })}
            />
        </main>
    );
}

export default ClaimValidation;
