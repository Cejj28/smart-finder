import './styles/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="app-layout">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
