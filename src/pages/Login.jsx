import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';
import '../styles/Login.css';

function Login({ onLogin }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);

        // Simulate authentication delay
        setTimeout(() => {
            // Mock credentials — admin@ustp.com / admin123
            if (form.email === 'admin@ustp.edu' && form.password === 'admin123') {
                onLogin({ name: 'Admin User', email: form.email, role: 'Administrator' });
            } else {
                setError('Invalid email or password.');
                setLoading(false);
            }
        }, 800);
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
                            <label htmlFor="login-email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📧</span>
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="admin@ustp.edu"
                                    autoComplete="email"
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
