import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }) {
    const classes = [
        'sidebar',
        isCollapsed ? 'collapsed' : '',
        isMobileOpen ? 'mobile-open' : '',
    ].filter(Boolean).join(' ');

    const linkClass = ({ isActive }) =>
        `sidebar-link${isActive ? ' active' : ''}`;

    return (
        <aside className={classes}>
            {(!isCollapsed || isMobileOpen) && (
                <>
                    <div className="sidebar-header">
                        <h2>Admin Panel</h2>
                    </div>
                    <nav className="sidebar-nav">
                        <NavLink to="/" className={linkClass} onClick={onCloseMobile} end>
                            <span className="sidebar-icon">📊</span>
                            Dashboard Overview
                        </NavLink>
                        <NavLink to="/verification" className={linkClass} onClick={onCloseMobile}>
                            <span className="sidebar-icon">✅</span>
                            Post Verification
                        </NavLink>
                        <NavLink to="/claims" className={linkClass} onClick={onCloseMobile}>
                            <span className="sidebar-icon">📋</span>
                            Claim Validation
                        </NavLink>
                        <NavLink to="/users" className={linkClass} onClick={onCloseMobile}>
                            <span className="sidebar-icon">👥</span>
                            User Management
                        </NavLink>
                        <NavLink to="/reports" className={linkClass} onClick={onCloseMobile}>
                            <span className="sidebar-icon">📈</span>
                            Generate Reports
                        </NavLink>
                    </nav>
                </>
            )}
        </aside>
    );
}

export default Sidebar;