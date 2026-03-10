import { motion } from 'framer-motion';
import { Package, ClipboardList, TrendingUp, DollarSign, AlertTriangle, Zap } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { useInventarioStore, useProduccionStore, useProductosStore, useTrabajadoresStore } from '../stores';
import { useEffect, useState } from 'react';

function KPICard({ icon: Icon, label, value, suffix, color, delay }: {
  icon: React.ElementType; label: string; value: number; suffix?: string; color: string; delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-5 flex items-start gap-4"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, color }}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-gray-medium)' }}>{label}</p>
        <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cacao)' }}>
          {suffix === '$' ? `$${displayValue.toLocaleString()}` : displayValue.toLocaleString()}
          {suffix && suffix !== '$' && <span className="text-sm font-normal ml-1" style={{ color: 'var(--color-gray-light)' }}>{suffix}</span>}
        </p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const activo = useInventarioStore(s => s.getActivo());
  const materias = useInventarioStore(s => s.materiasPrimas);
  const lotes = useProduccionStore(s => s.lotes);
  const productos = useProductosStore(s => s.productos);
  const trabajadores = useTrabajadoresStore(s => s.trabajadores);

  const activoMaterias = activo ? materias.filter(m => m.inventario_id === activo.id) : [];
  const alertas = activoMaterias.filter(m => m.cantidad_disponible <= m.stock_minimo_alerta);
  const lotesActivo = activo ? lotes.filter(l => l.inventario_id === activo.id) : [];
  const costoTotal = lotesActivo.reduce((sum, l) => sum + l.costo_total, 0);

  return (
    <PageWrapper title="Dashboard" subtitle="Resumen general de tu fábrica de chocolates">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard icon={Package} label="Productos Activos" value={productos.filter(p => p.activo).length} color="#C47B2B" delay={0.1} />
        <KPICard icon={ClipboardList} label="Lotes Registrados" value={lotesActivo.length} color="#6B3A2A" delay={0.2} />
        <KPICard icon={DollarSign} label="Costo Acumulado" value={Math.round(costoTotal)} suffix="$" color="#2E7D32" delay={0.3} />
        <KPICard icon={AlertTriangle} label="Alertas de Stock" value={alertas.length} color={alertas.length > 0 ? '#E65100' : '#888'} delay={0.4} />
      </div>

      {/* Quick Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5"
        >
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-cacao)' }}>
            <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
            Alertas de Inventario
          </h3>
          {alertas.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: 'var(--color-gray-light)' }}>
              ✅ Todo el stock está en niveles adecuados
            </p>
          ) : (
            <div className="space-y-2">
              {alertas.slice(0, 5).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{
                    background: a.cantidad_disponible === 0 ? 'rgba(178,34,34,0.06)' : 'rgba(230,81,0,0.06)',
                  }}
                >
                  <span className="text-sm font-medium">{a.nombre}</span>
                  <span className="text-sm font-mono font-semibold"
                    style={{ color: a.cantidad_disponible === 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                    {a.cantidad_disponible} {a.unidad}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-5"
        >
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-cacao)' }}>
            <TrendingUp size={18} style={{ color: 'var(--color-caramel)' }} />
            Resumen Rápido
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Materias primas registradas', value: activoMaterias.length, icon: '📦' },
              { label: 'Trabajadores activos', value: trabajadores.filter(t => t.activo).length, icon: '👷' },
              { label: 'Líneas de producto', value: 5, icon: '🍫' },
              { label: 'Precio kWh actual', value: activo ? `$${activo.precio_kwh}` : '-', icon: '⚡' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid rgba(240,229,203,0.5)' }}
              >
                <span className="text-sm flex items-center gap-2" style={{ color: 'var(--color-gray-medium)' }}>
                  {item.icon} {item.label}
                </span>
                <span className="text-sm font-mono font-semibold" style={{ color: 'var(--color-cacao)' }}>
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Production */}
      {lotesActivo.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-5 mt-6"
        >
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-cacao)' }}>
            <Zap size={18} style={{ color: 'var(--color-caramel)' }} />
            Últimos Lotes de Producción
          </h3>
          <table className="choco-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Turno</th>
                <th>Costo Total</th>
              </tr>
            </thead>
            <tbody>
              {lotesActivo.slice(-5).reverse().map(l => (
                <tr key={l.id}>
                  <td className="mono">{l.lote_codigo}</td>
                  <td>{l.fecha}</td>
                  <td className="capitalize">{l.turno}</td>
                  <td className="mono font-semibold">${l.costo_total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </PageWrapper>
  );
}
