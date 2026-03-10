import { AnimatePresence } from 'framer-motion';
import { Component, ReactNode, useEffect } from 'react';
import { useAuthStore, useUIStore, useInventarioStore } from './stores';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import InventariosPage from './modules/inventarios/InventariosPage';
import ProduccionPage from './modules/produccion/ProduccionPage';
import SimuladorPage from './modules/simulador/SimuladorPage';
import TrabajadoresPage from './modules/trabajadores/TrabajadoresPage';
import ReportesPage from './modules/reportes/ReportesPage';

// Error boundary to prevent entire app crash
class ErrorBoundary extends Component<{ children: ReactNode; onReset?: () => void }, { hasError: boolean; error: string }> {
  state = { hasError: false, error: '' };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</p>
          <h2 style={{ color: '#3D1C02', fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>
            Error en este módulo
          </h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>{this.state.error}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: '' })}
            style={{
              padding: '0.5rem 1.5rem', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #C47B2B, #A86820)', color: 'white',
              fontWeight: 600, cursor: 'pointer'
            }}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const activeModule = useUIStore(s => s.activeModule);
  const sidebarCollapsed = useUIStore(s => s.sidebarCollapsed);
  const { initialize: initInventario, fetching } = useInventarioStore();

  useEffect(() => {
    initInventario();
  }, [initInventario]);

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--color-surface)' }}>
         <div className="text-center z-10 relative">
          <div className="w-16 h-16 border-4 border-t-transparent border-[var(--color-cacao)] rounded-full animate-spin mx-auto mb-4 drop-shadow-lg"></div>
          <p className="text-xl font-bold" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>Cargando inventarios y catálogo...</p>
        </div>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardPage />;
      case 'inventarios': return <InventariosPage />;
      case 'produccion': return <ProduccionPage />;
      case 'simulador': return <SimuladorPage />;
      case 'trabajadores': return <TrabajadoresPage />;
      case 'reportes': return <ReportesPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <Sidebar />
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        <Header />
        <ErrorBoundary key={activeModule}>
          <AnimatePresence mode="wait">
            <div key={activeModule}>
              {renderModule()}
            </div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-[var(--color-cacao)] rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>Cargando ChocoDash...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? <AppContent key="app" /> : <LoginPage key="login" />}
    </AnimatePresence>
  );
}
