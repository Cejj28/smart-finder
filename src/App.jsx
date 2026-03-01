import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Login from './pages/Login'

// Lazy-loaded route pages — each page loads only when navigated to
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PostVerification = lazy(() => import('./pages/PostVerification'));
const ClaimValidation = lazy(() => import('./pages/ClaimValidation'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const Reports = lazy(() => import('./pages/Reports'));
const Profile = lazy(() => import('./pages/Profile'));

const MOBILE_BREAKPOINT = 768;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sf_auth') === 'true';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleLogin = useCallback((user) => {
    localStorage.setItem('sf_auth', 'true');
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('sf_auth');
    setIsAuthenticated(false);
  }, []);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      <ScrollToTop />
      <Header onToggleSidebar={handleToggleSidebar} onLogout={handleLogout} />
      <div className="app-body">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          isMobileOpen={mobileOpen}
          onCloseMobile={handleCloseMobile}
        />
        {mobileOpen && (
          <div className="sidebar-overlay" onClick={handleCloseMobile} />
        )}
        <div className="app-content">
          <Suspense fallback={<div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>Loading…</div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/verification" element={<PostVerification />} />
              <Route path="/claims" element={<ClaimValidation />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
