import { useState, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import useConfirmModal from '../hooks/useConfirmModal';
import useSearch from '../hooks/useSearch';
import useFormHandler from '../hooks/useFormHandler';
import { usersData as initialUsers } from '../data/mockData';
import '../styles/Pages.css';

const EMPTY_FORM = { name: '', email: '', role: 'Student', status: 'Active' };
const SEARCH_FIELDS = ['name', 'email', 'role'];

function UserManagement() {
    const [users, setUsers] = useState(initialUsers);
    const [editingId, setEditingId] = useState(null);
    const { form, setForm, feedback, handleChange, resetForm, showFeedback, setFeedback } = useFormHandler(EMPTY_FORM);
    const { searchTerm, setSearchTerm, filtered } = useSearch(users, SEARCH_FIELDS);

    // Dynamic confirm props because toggle action depends on current user status
    const getConfirmAction = useCallback((action, id) => {
        switch (action) {
            case 'delete':
                return { title: 'Delete User', message: 'Are you sure you want to delete this user? This action cannot be undone.', confirmLabel: 'Delete', variant: 'danger' };
            case 'toggle': {
                const user = users.find(u => u.id === id);
                const newStatus = user?.status === 'Active' ? 'Inactive' : 'Active';
                return { title: 'Change User Status', message: `Are you sure you want to set this user to ${newStatus}?`, confirmLabel: `Set ${newStatus}`, variant: 'warning' };
            }
            default:
                return {};
        }
    }, [users]);

    const { confirm, openConfirm, closeConfirm, confirmProps } = useConfirmModal(getConfirmAction);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            showFeedback('Name and email are required.', 0);
            return;
        }

        if (editingId) {
            setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...form } : u));
            setEditingId(null);
            showFeedback('User updated successfully!');
        } else {
            const newUser = { id: Date.now(), ...form };
            setUsers(prev => [newUser, ...prev]);
            showFeedback('User added successfully!');
        }
        resetForm();
    }, [form, editingId, resetForm, showFeedback]);

    const handleEdit = useCallback((user) => {
        setEditingId(user.id);
        setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
        setFeedback('');
    }, [setForm, setFeedback]);

    const handleConfirm = useCallback(() => {
        const { id, action } = confirm;
        if (action === 'delete') {
            setUsers(prev => prev.filter(u => u.id !== id));
            if (editingId === id) {
                setEditingId(null);
                resetForm();
            }
        } else if (action === 'toggle') {
            setUsers(prev => prev.map(u =>
                u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
            ));
        }
        closeConfirm();
    }, [confirm, editingId, closeConfirm, resetForm]);

    const handleCancel = useCallback(() => {
        setEditingId(null);
        resetForm();
    }, [resetForm]);

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage students, faculty, and staff accounts in the system.</p>
            </div>

            {/* User Form */}
            <section className="form-card">
                <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
                {feedback && <div className={`form-feedback ${feedback.includes('success') ? 'success' : 'error'}`}>{feedback}</div>}
                <form onSubmit={handleSubmit} className="page-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="um-name">Full Name *</label>
                            <input id="um-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Juan Dela Cruz" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="um-email">Email Address *</label>
                            <input id="um-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="e.g. juan@university.edu" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="um-role">Role</label>
                            <select id="um-role" name="role" value={form.role} onChange={handleChange}>
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Staff">Staff</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="um-status">Status</label>
                            <select id="um-status" name="status" value={form.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            {editingId ? 'Update User' : 'Add User'}
                        </button>
                        {editingId && (
                            <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                        )}
                    </div>
                </form>
            </section>

            {/* Users Table */}
            <section className="table-card">
                <div className="search-header">
                    <h2>All Users ({filtered.length})</h2>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className="role-badge">{u.role}</span></td>
                                    <td>
                                        <span className={`status-indicator ${u.status === 'Active' ? 'active' : 'inactive'}`}
                                            onClick={() => openConfirm(u.id, 'toggle')}
                                            title="Click to toggle status">
                                            {u.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                                        <button className="btn-delete" onClick={() => openConfirm(u.id, 'delete')}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p className="empty-state">No users found.</p>}
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
        </main>
    );
}

export default UserManagement;
