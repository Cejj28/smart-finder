import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isMobileOpen, onCloseMobile }) {
    const classes = [
        'sidebar',
        isMobileOpen ? 'mobile-open' : '',
    ].filter(Boolean).join(' ');

    const linkClass = ({ isActive }) =>
        `sidebar-link${isActive ? ' active' : ''}`;

    return (
        <aside className={classes}>
            <div className="sidebar-header">
                <h2>Admin</h2>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" className={linkClass} onClick={onCloseMobile} end>
                    <span className="sidebar-icon">📊</span>
                    <span className="sidebar-text">Dashboard Overview</span>
                </NavLink>
                <NavLink to="/verification" className={linkClass} onClick={onCloseMobile}>
                    <span className="sidebar-icon">✅</span>
                    <span className="sidebar-text">Post Verification</span>
                </NavLink>
                <NavLink to="/claims" className={linkClass} onClick={onCloseMobile}>
                    <span className="sidebar-icon">📋</span>
                    <span className="sidebar-text">Claim Validation</span>
                </NavLink>
                <NavLink to="/users" className={linkClass} onClick={onCloseMobile}>
                    <span className="sidebar-icon">👥</span>
                    <span className="sidebar-text">User Management</span>
                </NavLink>
                <NavLink to="/reports" className={linkClass} onClick={onCloseMobile}>
                    <span className="sidebar-icon">📈</span>
                    <span className="sidebar-text">Generate Reports</span>
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;