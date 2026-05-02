import { useState } from 'react';
import logo from '../assets/logo2.png';
import '../styles/Login.css';
import { loginApi } from '../services/api';

function Login({ onLogin }) {
    const [form, setForm] = useState({ identifier: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.identifier || !form.password) {
            setError('Please enter both identifier (username/email) and password.');
            return;
        }

        setLoading(true);

        try {
            const data = await loginApi(form.identifier, form.password);
            
            // Block non-staff from the web admin portal
            if (!data.is_staff) {
                setError('Access Denied. Only staff members can access the Admin Portal.');
                setLoading(false);
                return;
            }

            onLogin({
                name: data.username,
                email: data.email,
                role: data.is_staff ? 'Administrator' : 'User',
                token: data.token,
                is_staff: data.is_staff
            });
        } catch (err) {
            setError('Invalid username/email or password.');
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="login-shape shape-1"></div>
                <div className="login-shape shape-2"></div>
                <div className="login-shape shape-3"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <img src={logo} alt="SmartFinder Logo" className="login-logo" />
                        <h1>SmartFinder</h1>
                        <p>Admin Portal — Lost & Found Management</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
                            <label htmlFor="login-identifier">Username or Email</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    id="login-identifier"
                                    type="text"
                                    name="identifier"
                                    value={form.identifier}
                                    onChange={handleChange}
                                    placeholder="Enter username or email"
                                    autoComplete="username"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="login-password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    id="login-password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? (
                                <span className="login-spinner"></span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Smart Lost & Found System &copy; 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
