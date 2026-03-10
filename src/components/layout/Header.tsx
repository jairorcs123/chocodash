import { Bell, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventarioStore, useAuthStore } from '../../stores';
import { useState } from 'react';

export default function Header() {
  const activo = useInventarioStore(s => s.getActivo());
  const materias = useInventarioStore(s => s.materiasPrimas);
  const user = useAuthStore(s => s.user);
  const [showAlerts, setShowAlerts] = useState(false);

  const alertas = activo
    ? materias
        .filter(mp => mp.inventario_id === activo.id && mp.cantidad_disponible <= mp.stock_minimo_alerta)
        .map(mp => ({
          ...mp,
          critico: mp.cantidad_disponible === 0,
        }))
    : [];

  return (
    <header
      className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b"
      style={{
        background: 'rgba(253, 250, 246, 0.9)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(196, 123, 43, 0.1)',
      }}
    >
      {/* Left: Active Inventory */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--color-gray-medium)' }}>
            Inventario Activo
          </p>
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>
            {activo ? activo.nombre : 'Sin inventario activo'}
          </h2>
        </div>
        {activo && (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-success)' }}
          >
            Activo
          </span>
        )}
      </div>

      {/* Right: Alerts + User */}
      <div className="flex items-center gap-4">
        {/* Stock Alerts */}
        <div className="relative">
          <motion.button
            onClick={() => setShowAlerts(prev => !prev)}
            className="relative p-2 rounded-xl transition-colors"
            style={{ color: alertas.length > 0 ? 'var(--color-warning)' : 'var(--color-gray-light)' }}
            animate={alertas.length > 0 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Bell size={20} />
            {alertas.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ background: alertas.some(a => a.critico) ? 'var(--color-danger)' : 'var(--color-warning)' }}
              >
                {alertas.length}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showAlerts && alertas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 rounded-2xl shadow-xl overflow-hidden z-50"
                style={{ background: 'white', border: '1px solid rgba(196, 123, 43, 0.15)' }}
              >
                <div className="px-4 py-3 font-semibold text-sm flex items-center gap-2"
                  style={{ background: 'var(--color-crema)', color: 'var(--color-cacao)' }}>
                  <AlertTriangle size={16} />
                  Alertas de Stock ({alertas.length})
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {alertas.map(a => (
                    <div key={a.id} className="px-4 py-3 border-b flex items-start gap-3"
                      style={{ borderColor: 'rgba(240, 229, 203, 0.5)' }}>
                      <div
                        className="w-2 h-2 mt-1.5 rounded-full flex-shrink-0"
                        style={{ background: a.critico ? 'var(--color-danger)' : 'var(--color-warning)' }}
                      />
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-carbon)' }}>
                          {a.nombre}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-gray-medium)' }}>
                          Stock: <span className="font-mono font-semibold"
                            style={{ color: a.critico ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                            {a.cantidad_disponible} {a.unidad}
                          </span>
                          {' '}(mín: {a.stock_minimo_alerta} {a.unidad})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'rgba(196, 123, 43, 0.15)' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, var(--color-caramel), var(--color-mocha))' }}
          >
            {user?.nombre?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-carbon)' }}>
              {user?.nombre || 'Admin'}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-gray-light)' }}>
              {user?.rol || 'admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
