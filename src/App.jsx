import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import './styles/App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Dashboard from './pages/Dashboard'
import PostVerification from './pages/PostVerification'
import ClaimValidation from './pages/ClaimValidation'
import UserManagement from './pages/UserManagement'
import Reports from './pages/Reports'
import Profile from './pages/Profile'

const MOBILE_BREAKPOINT = 768;

function App() {
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

  return (
    <div className="app-layout">
      <ScrollToTop />
      <Header onToggleSidebar={handleToggleSidebar} />
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
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/verification" element={<PostVerification />} />
            <Route path="/claims" element={<ClaimValidation />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
