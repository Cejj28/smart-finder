import { useState } from 'react'
import './styles/App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="app-body">
        <Sidebar isCollapsed={sidebarCollapsed} />
        <div className="app-content">
          <Dashboard />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
