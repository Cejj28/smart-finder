import { useState, useCallback, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import DetailPanel from '../components/DetailPanel';
import useConfirmModal from '../hooks/useConfirmModal';
import useSearch from '../hooks/useSearch';
import useFormHandler from '../hooks/useFormHandler';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/api';
import '../styles/Pages.css';

const EMPTY_FORM = { name: '', username: '', email: '', role: 'Student', status: 'Active' };
const SEARCH_FIELDS = ['name', 'email', 'role'];

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { form, setForm, feedback, handleChange, resetForm, showFeedback, setFeedback } = useFormHandler(EMPTY_FORM);
    const { searchTerm, setSearchTerm, filtered } = useSearch(users, SEARCH_FIELDS);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            showFeedback('Failed to load users from server.', 0);
        } finally {
            setLoading(false);
        }
    }, [showFeedback]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Dynamic confirm props because toggle action depends on current user status
    const getConfirmAction = useCallback((action, id) => {
        switch (action) {
            case 'delete':
                return { title: 'Delete User', message: 'Are you sure you want to delete this user? This action cannot be undone.', confirmLabel: 'Delete', variant: 'danger' };
            case 'submit':
                return { title: editingId ? 'Update User' : 'Add User', message: `Are you sure you want to ${editingId ? 'update' : 'add'} this user?`, confirmLabel: editingId ? 'Update' : 'Add', variant: 'primary' };
            case 'toggle':
                return { title: 'Change Status', message: 'Are you sure you want to change this user\'s active status?', confirmLabel: 'Change', variant: 'primary' };
            default:
                return {};
        }
    }, [editingId]);

    const { confirm, openConfirm, closeConfirm, confirmProps } = useConfirmModal(getConfirmAction);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            showFeedback('Name and email are required.', 0);
            return;
        }
        openConfirm(null, 'submit');
    }, [form, openConfirm, showFeedback]);

    const handleEdit = useCallback((user) => {
        setEditingId(user.id);
        setForm({ name: user.name, username: user.username, email: user.email, role: user.role, status: user.status });
        setFeedback('');
    }, [setForm, setFeedback]);

    const handleConfirm = useCallback(async () => {
        const { id, action } = confirm;
        try {
            if (action === 'submit') {
                if (editingId) {
                    await updateUser(editingId, form);
                    showFeedback('User updated successfully!');
                } else {
                    await createUser(form);
                    showFeedback('User added successfully!');
                }
                loadUsers();
                setEditingId(null);
                resetForm();
            } else if (action === 'delete') {
                await deleteUser(id);
                showFeedback('User deleted successfully!');
                loadUsers();
            } else if (action === 'toggle') {
                const user = users.find(u => u.id === id);
                await updateUser(id, { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' });
                showFeedback('Status updated successfully!');
                loadUsers();
            }
        } catch (err) {
            showFeedback('Server error: ' + err.message, 0);
        } finally {
            closeConfirm();
            if (action === 'delete') setSelectedUser(null);
        }
    }, [confirm, editingId, loadUsers, closeConfirm, resetForm, form, showFeedback]);

    const detailFields = [
        { label: 'Full Name', key: 'name' },
        { label: 'Username', key: 'username' },
        { label: 'Email Address', key: 'email' },
        { label: 'Role', key: 'role', render: (val) => <span className="role-badge">{val}</span> },
        { label: 'Status', key: 'status', render: (val, u) => (
            <span className={`status-indicator ${val === 'Active' ? 'active' : 'inactive'}`} onClick={() => openConfirm(u.id, 'toggle')} title="Click to toggle status">{val}</span>
        )}
    ];

    const handleCancel = useCallback(() => {
        setEditingId(null);
        resetForm();
    }, [resetForm]);

    return (
        <main className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <div className="page-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    User Management
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage university accounts, roles, and system access.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
                {/* User Form */}
                <section className="form-card" style={{ 
                    background: '#fff', 
                    padding: '2rem', 
                    borderRadius: '24px', 
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0',
                    position: 'sticky',
                    top: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1e293b' }}>
                        {editingId ? '📝 Edit User' : '➕ Add New User'}
                    </h2>
                    
                    {feedback && (
                        <div style={{ 
                            padding: '12px 16px', 
                            borderRadius: '12px', 
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            background: feedback.includes('success') ? '#f0fdf4' : '#fef2f2',
                            color: feedback.includes('success') ? '#166534' : '#991b1b',
                            border: `1px solid ${feedback.includes('success') ? '#bbf7d0' : '#fecaca'}`
                        }}>
                            {feedback}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Full Name *</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={form.name} 
                                onChange={(e) => {
                                    handleChange(e);
                                    // Auto-generate username as they type the name
                                    if (!editingId) {
                                        const autoUser = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                                        setForm(prev => ({ ...prev, username: autoUser }));
                                    }
                                }} 
                                placeholder="e.g. Juan Dela Cruz" 
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0',
                                    marginTop: '6px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Username *</label>
                            <input 
                                type="text" 
                                name="username" 
                                value={form.username} 
                                onChange={handleChange} 
                                placeholder="e.g. juan_dela_cruz" 
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0',
                                    marginTop: '6px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Email Address *</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                placeholder="e.g. juan@university.edu" 
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0',
                                    marginTop: '6px', fontSize: '1rem', outline: 'none', transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Role</label>
                                <select 
                                    name="role" 
                                    value={form.role} 
                                    onChange={handleChange}
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0',
                                        marginTop: '6px', fontSize: '1rem', outline: 'none', background: '#fff'
                                    }}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>Status</label>
                                <select 
                                    name="status" 
                                    value={form.status} 
                                    onChange={handleChange}
                                    style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0',
                                        marginTop: '6px', fontSize: '1rem', outline: 'none', background: '#fff'
                                    }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" style={{ 
                                flex: 2, padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem',
                                border: 'none', background: 'var(--primary-color)', color: '#fff', cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                            }}>
                                {editingId ? 'Update User' : 'Add User'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancel} style={{ 
                                    flex: 1, padding: '14px', borderRadius: '12px', fontWeight: '600',
                                    border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer'
                                }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* Users Table Section */}
                <section>
                    <div style={{ 
                        background: '#fff', 
                        padding: '1.5rem', 
                        borderRadius: '24px 24px 0 0', 
                        border: '1px solid #e2e8f0',
                        borderBottom: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Users ({filtered.length})</h2>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                width: '250px', outline: 'none', fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div className="table-wrapper" style={{ 
                        background: '#fff', 
                        borderRadius: '0 0 24px 24px', 
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>User</th>
                                    <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Role</th>
                                    <th style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => (
                                    <tr 
                                        key={u.id} 
                                        onClick={() => setSelectedUser(u)}
                                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: '700', color: '#1e293b' }}>{u.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>@{u.username}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{u.email}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ 
                                                padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700',
                                                background: u.role === 'Admin' ? '#fef3c7' : '#e0f2fe',
                                                color: u.role === 'Admin' ? '#92400e' : '#0369a1'
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ 
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    background: u.status === 'Active' ? '#22c55e' : '#94a3b8'
                                                }} />
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: u.status === 'Active' ? '#166534' : '#64748b' }}>
                                                    {u.status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                <p>No users found matching your search.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

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
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title="User Profile Details"
                data={selectedUser || {}}
                fields={detailFields}
                actions={
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => openConfirm(selectedUser.id, 'toggle')}>
                            Toggle Status
                        </button>
                        <button className="btn-edit" style={{ flex: 1, background: '#f1f5f9', border: '1px solid #e2e8f0' }} onClick={() => { handleEdit(selectedUser); setSelectedUser(null); }}>
                            Edit
                        </button>
                        <button className="btn-delete" style={{ flex: 1, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }} onClick={() => openConfirm(selectedUser.id, 'delete')}>
                            Delete
                        </button>
                    </div>
                }
            />
        </main>
    );
}

export default UserManagement;
