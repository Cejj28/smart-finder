import { useState, useEffect, useCallback } from 'react'
import './styles/App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'

const MOBILE_BREAKPOINT = 768;

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  // Track viewport width to know if we're on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      // Auto-close mobile drawer when resizing to desktop
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
          <Dashboard />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
