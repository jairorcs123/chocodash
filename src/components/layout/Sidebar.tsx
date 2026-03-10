import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ClipboardList, Calculator,
  Users, BarChart3, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { useUIStore, useAuthStore } from '../../stores';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventarios', label: 'Inventarios', icon: Package },
  { id: 'produccion', label: 'Producción', icon: ClipboardList },
  { id: 'simulador', label: 'Simulador', icon: Calculator },
  { id: 'trabajadores', label: 'Trabajadores', icon: Users },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeModule, setActiveModule } = useUIStore();
  const logout = useAuthStore(s => s.logout);

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen fixed left-0 top-0 z-50 flex flex-col"
      style={{ background: 'linear-gradient(180deg, #3D1C02 0%, #2a1301 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #C47B2B, #D4943E)' }}>
          🍫
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                ChocoDash
              </h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Gestión Integral</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left ${isActive ? 'shadow-lg' : ''}`}
              style={{
                background: isActive ? 'rgba(196, 123, 43, 0.2)' : 'transparent',
                color: isActive ? '#D4943E' : 'rgba(255,255,255,0.6)',
                borderLeft: isActive ? '3px solid #C47B2B' : '3px solid transparent',
              }}
            >
              <Icon size={24} className="flex-shrink-0 drop-shadow-sm" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-base font-semibold whitespace-nowrap tracking-wide"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout & Collapse */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D4943E')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Cerrar sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center py-2 rounded-xl transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}
