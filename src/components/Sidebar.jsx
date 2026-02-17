import '../styles/Sidebar.css';

function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }) {
    const classes = [
        'sidebar',
        isCollapsed ? 'collapsed' : '',
        isMobileOpen ? 'mobile-open' : '',
    ].filter(Boolean).join(' ');

    return (
        <aside className={classes}>
            {(!isCollapsed || isMobileOpen) && (
                <>
                    <div className="sidebar-header">
                        <h2>Admin Panel</h2>
                    </div>
                    <nav className="sidebar-nav">
                        <a href="#dashboard" className="sidebar-link active" onClick={onCloseMobile}>
                            <span className="sidebar-icon">📊</span>
                            Dashboard Overview
                        </a>
                        <a href="#verification" className="sidebar-link" onClick={onCloseMobile}>
                            <span className="sidebar-icon">✅</span>
                            Post Verification
                        </a>
                        <a href="#claims" className="sidebar-link" onClick={onCloseMobile}>
                            <span className="sidebar-icon">📋</span>
                            Claim Validation
                        </a>
                        <a href="#users" className="sidebar-link" onClick={onCloseMobile}>
                            <span className="sidebar-icon">👥</span>
                            User Management
                        </a>
                        <a href="#reports" className="sidebar-link" onClick={onCloseMobile}>
                            <span className="sidebar-icon">📈</span>
                            Generate Reports
                        </a>
                    </nav>
                </>
            )}
        </aside>
    );
}

export default Sidebar;