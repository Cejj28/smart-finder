import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { usersData as initialUsers } from '../data/mockData';
import '../styles/Pages.css';

const emptyForm = { name: '', email: '', role: 'Student', status: 'Active' };

function UserManagement() {
    const [users, setUsers] = useState(initialUsers);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [feedback, setFeedback] = useState('');
    const [confirm, setConfirm] = useState({ open: false, id: null, action: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            setFeedback('Name and email are required.');
            return;
        }

        if (editingId) {
            setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...form } : u));
            setEditingId(null);
            setFeedback('User updated successfully!');
        } else {
            const newUser = { id: Date.now(), ...form };
            setUsers([newUser, ...users]);
            setFeedback('User added successfully!');
        }
        setForm(emptyForm);
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
        setFeedback('');
    };

    const handleConfirm = () => {
        const { id, action } = confirm;
        if (action === 'delete') {
            setUsers(prev => prev.filter(u => u.id !== id));
            if (editingId === id) {
                setEditingId(null);
                setForm(emptyForm);
            }
        } else if (action === 'toggle') {
            setUsers(prev => prev.map(u =>
                u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
            ));
        }
        setConfirm({ open: false, id: null, action: '' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFeedback('');
    };

    const getConfirmProps = () => {
        switch (confirm.action) {
            case 'delete':
                return { title: 'Delete User', message: 'Are you sure you want to delete this user? This action cannot be undone.', confirmLabel: 'Delete', variant: 'danger' };
            case 'toggle': {
                const user = users.find(u => u.id === confirm.id);
                const newStatus = user?.status === 'Active' ? 'Inactive' : 'Active';
                return { title: 'Change User Status', message: `Are you sure you want to set this user to ${newStatus}?`, confirmLabel: `Set ${newStatus}`, variant: 'warning' };
            }
            default:
                return {};
        }
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmProps = getConfirmProps();

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
                                            onClick={() => setConfirm({ open: true, id: u.id, action: 'toggle' })}
                                            title="Click to toggle status">
                                            {u.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                                        <button className="btn-delete" onClick={() => setConfirm({ open: true, id: u.id, action: 'delete' })}>Delete</button>
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
                onCancel={() => setConfirm({ open: false, id: null, action: '' })}
            />
        </main>
    );
}

export default UserManagement;
