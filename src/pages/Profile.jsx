import { useState, useCallback } from 'react';
import useFormHandler from '../hooks/useFormHandler';
import { adminProfile as initialProfile } from '../data/mockData';
import '../styles/Pages.css';

function Profile() {
    const [profile, setProfile] = useState(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const { form, setForm, feedback, handleChange, showFeedback, setFeedback } = useFormHandler(initialProfile);

    const handleEdit = useCallback(() => {
        setForm(profile);
        setIsEditing(true);
        setFeedback('');
    }, [profile, setForm, setFeedback]);

    const handleCancel = useCallback(() => {
        setForm(profile);
        setIsEditing(false);
        setFeedback('');
    }, [profile, setForm, setFeedback]);

    const handleSave = useCallback((e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            showFeedback('Name and email are required.', 0);
            return;
        }
        setProfile(form);
        setIsEditing(false);
        showFeedback('Profile updated successfully!');
    }, [form, showFeedback]);

    return (
        <main className="page-container">
            <div className="page-header">
                <h1>Admin Profile</h1>
                <p>View and manage your admin account details.</p>
            </div>

            <section className="form-card profile-card">
                {feedback && <div className={`form-feedback ${feedback.includes('success') ? 'success' : 'error'}`}>{feedback}</div>}

                {!isEditing ? (
                    /* View Mode */
                    <div className="profile-view">
                        <div className="profile-avatar">
                            <span className="avatar-icon">👤</span>
                            <span className="profile-role-badge">{profile.role}</span>
                        </div>
                        <div className="profile-details">
                            <div className="profile-field">
                                <span className="field-label">Full Name</span>
                                <span className="field-value">{profile.name}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Email Address</span>
                                <span className="field-value">{profile.email}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Phone Number</span>
                                <span className="field-value">{profile.phone}</span>
                            </div>
                            <div className="profile-field">
                                <span className="field-label">Bio</span>
                                <span className="field-value">{profile.bio}</span>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleEdit}>Edit Profile</button>
                    </div>
                ) : (
                    /* Edit Mode */
                    <form onSubmit={handleSave} className="page-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="pf-name">Full Name *</label>
                                <input id="pf-name" type="text" name="name" value={form.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pf-email">Email Address *</label>
                                <input id="pf-email" type="email" name="email" value={form.email} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="pf-phone">Phone Number</label>
                                <input id="pf-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pf-bio">Bio</label>
                            <textarea id="pf-bio" name="bio" value={form.bio} onChange={handleChange} rows="3" />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Save Changes</button>
                            <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                )}
            </section>
        </main>
    );
}

export default Profile;
