import { useState, useEffect, useCallback } from 'react';
import useFormHandler from '../hooks/useFormHandler';
import { fetchProfile, updateProfile, changePassword } from '../services/api';
import '../styles/Pages.css';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const { form, setForm, feedback, handleChange, showFeedback, setFeedback } = useFormHandler({
        full_name: '',
        email: '',
        department: '',
    });

    const [pwdForm, setPwdForm] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchProfile();
            setProfile(data);
            setForm({
                full_name: data.full_name || '',
                email: data.email || '',
                department: data.department || '',
            });
        } catch (err) {
            showFeedback('Failed to load profile. Please try again.', 0);
        } finally {
            setLoading(false);
        }
    }, [setForm, showFeedback]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleEdit = () => {
        setIsEditing(true);
        setFeedback('');
    };

    const handleCancel = () => {
        setForm({
            full_name: profile.full_name || '',
            email: profile.email || '',
            department: profile.department || '',
        });
        setIsEditing(false);
        setFeedback('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.full_name || !form.email) {
            showFeedback('Name and email are required.', 0);
            return;
        }
        try {
            const updated = await updateProfile(form);
            setProfile(updated);
            setIsEditing(false);
            showFeedback('Profile updated successfully!');
        } catch (err) {
            showFeedback('Failed to update profile.', 0);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwdForm.new_password !== pwdForm.confirm_password) {
            showFeedback('New passwords do not match.', 0);
            return;
        }
        try {
            await changePassword(pwdForm);
            setIsChangingPassword(false);
            setPwdForm({ current_password: '', new_password: '', confirm_password: '' });
            showFeedback('Password updated successfully!');
        } catch (err) {
            let msg = 'Failed to update password.';
            try {
                const errObj = JSON.parse(err.message);
                if (errObj.current_password) msg = 'Current password is incorrect.';
                else if (errObj.new_password) msg = errObj.new_password[0];
            } catch(e) {}
            showFeedback(msg, 0);
        }
    };

    if (loading) return <div className="page-container"><p>Loading profile...</p></div>;

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>{profile?.is_staff ? 'Admin Profile' : 'User Profile'}</h1>
                <p>View and manage your account details.</p>
            </div>

            <section className="form-card profile-card">
                {feedback && <div className={`form-feedback ${feedback.includes('success') ? 'success' : 'error'}`}>{feedback}</div>}

                {!isEditing && !isChangingPassword ? (
                    <div className="profile-view">
                        <div className="profile-avatar">
                            <span className="avatar-icon">👤</span>
                            <span className="profile-role-badge">{profile?.role}</span>
                        </div>
                        <div className="profile-details">
                            <div className="profile-field">
                                <span className="field-label">Username</span>
                                <span className="field-value">{profile?.username}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Full Name</span>
                                <span className="field-value">{profile?.full_name || 'Not set'}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Email Address</span>
                                <span className="field-value">{profile?.email}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Department</span>
                                <span className="field-value">{profile?.department || 'Not set'}</span>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-primary" onClick={handleEdit}>Edit Profile</button>
                            <button className="btn-secondary" onClick={() => setIsChangingPassword(true)}>Change Password</button>
                        </div>
                    </div>
                ) : isEditing ? (
                    <form onSubmit={handleSave} className="page-form">
                        <h2>Edit Profile</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input type="text" name="department" value={form.department} onChange={handleChange} />
                        </div>
                        <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                            <button type="submit" className="btn-primary">Save Changes</button>
                            <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordChange} className="page-form">
                        <h2>Change Password</h2>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input 
                                type="password" 
                                value={pwdForm.current_password} 
                                onChange={(e) => setPwdForm({...pwdForm, current_password: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                value={pwdForm.new_password} 
                                onChange={(e) => setPwdForm({...pwdForm, new_password: e.target.value})} 
                                required 
                                minLength={6}
                            />
                        </div>
                        <div className="form-group">
                            <label>Retype New Password</label>
                            <input 
                                type="password" 
                                value={pwdForm.confirm_password} 
                                onChange={(e) => setPwdForm({...pwdForm, confirm_password: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                            <button type="submit" className="btn-primary">Update Password</button>
                            <button type="button" className="btn-secondary" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                        </div>
                    </form>
                )}
            </section>
        </main>
    );
}

export default Profile;
