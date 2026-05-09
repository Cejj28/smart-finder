import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/logo.png';
import useClickOutside from '../hooks/useClickOutside';
import ConfirmModal from './ConfirmModal';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

function Header({ onToggleSidebar, onLogout }) {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    const loadNotifications = useCallback(async () => {
        try {
            const data = await fetchNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [loadNotifications]);

    const handleNotifClick = async (notif) => {
        try {
            if (!notif.is_read) {
                await markNotificationRead(notif.id);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            }
            setNotifOpen(false);
            if (notif.target_page) navigate(notif.target_page);
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

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
                            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                        </button>

                        {notifOpen && (
                            <div className="notif-dropdown">
                                <div className="dropdown-header">
                                    <span>Notifications</span>
                                    {unreadCount > 0 && (
                                        <button className="mark-all-read" onClick={handleMarkAllRead}>
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="notif-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div className="notif-empty">No notifications</div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div 
                                                key={n.id} 
                                                className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                                                onClick={() => handleNotifClick(n)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="notif-content">
                                                    <h4 className="notif-title" style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: n.is_read ? '600' : '800' }}>
                                                        {n.title}
                                                    </h4>
                                                    <p className="notif-message">
                                                        {n.message}
                                                    </p>
                                                    <span className="notif-time">
                                                        {new Date(n.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                {!n.is_read && <span className="unread-dot"></span>}
                                            </div>
                                        ))
                                    )}
                                </div>
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
                                <span className="dropdown-item dropdown-logout" onClick={() => { setProfileOpen(false); setShowLogoutConfirm(true); }}>
                                    🚪 Log Out
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showLogoutConfirm}
                title="Log Out"
                message="Are you sure you want to log out?"
                confirmLabel="Log Out"
                variant="danger"
                onConfirm={() => { setShowLogoutConfirm(false); onLogout(); }}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </header>
    );
}

export default Header;
