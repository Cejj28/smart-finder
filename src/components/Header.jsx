import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/logo.png';
import useClickOutside from '../hooks/useClickOutside';
import { notifications } from '../data/mockData';

function Header({ onToggleSidebar }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useClickOutside(profileRef, () => setProfileOpen(false));
    useClickOutside(notifRef, () => setNotifOpen(false));

    return (
        <header className="app-header">
            <div className="header-container">
                <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
                    ☰
                </button>
                <div className="logo-section">
                    <img src={logo} alt="SmartFinder Logo" className="header-logo" />
                    <div className="title-group">
                        <h1 className="app-title">SmartFinder</h1>
                        <p className="app-tagline">Lost &amp; Found Management System</p>
                    </div>
                </div>

                <div className="header-actions">
                    <div className="notif-wrapper" ref={notifRef}>
                        <button
                            className="header-icon-btn"
                            title="Notifications"
                            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                        >
                            🔔
                            <span className="notif-badge">{notifications.length}</span>
                        </button>

                        {notifOpen && (
                            <div className="notif-dropdown">
                                <div className="dropdown-header">Notifications</div>
                                {notifications.map((n) => (
                                    <div key={n.id} className="notif-item">
                                        <p className="notif-message">{n.message}</p>
                                        <span className="notif-time">{n.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="profile-wrapper" ref={profileRef}>
                        <button
                            className="header-icon-btn profile-btn"
                            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                            title="Profile"
                        >
                            👤
                        </button>

                        {profileOpen && (
                            <div className="profile-dropdown">
                                <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                    📋 Profile
                                </Link>
                                <Link to="/" className="dropdown-item dropdown-logout" onClick={() => setProfileOpen(false)}>
                                    🚪 Log Out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
