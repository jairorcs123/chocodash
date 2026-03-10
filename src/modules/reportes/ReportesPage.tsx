import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { useProduccionStore, useInventarioStore, useProductosStore } from '../../stores';

const COLORS = ['#C47B2B', '#3D1C02', '#6B3A2A', '#D4943E', '#8B5A4A', '#2E7D32', '#E65100', '#A86820'];

export default function ReportesPage() {
  const lotes = useProduccionStore(s => s.lotes);
  const loteProductos = useProduccionStore(s => s.loteProductos);
  const activo = useInventarioStore(s => s.getActivo());
  const materias = useInventarioStore(s => s.materiasPrimas);
  const productos = useProductosStore(s => s.productos);

  const lotesActivo = activo ? lotes.filter(l => l.inventario_id === activo.id) : [];

  // Cost breakdown
  const costBreakdown = useMemo(() => {
    const totalMP = lotesActivo.reduce((s, l) => s + l.costo_total_mp, 0);
    const totalElec = lotesActivo.reduce((s, l) => s + l.costo_total_electricidad, 0);
    const totalMO = lotesActivo.reduce((s, l) => s + l.costo_total_mano_obra, 0);
    return [
      { name: 'Materia Prima', value: +totalMP.toFixed(2), color: '#C47B2B' },
      { name: 'Electricidad', value: +totalElec.toFixed(2), color: '#3D1C02' },
      { name: 'Mano de Obra', value: +totalMO.toFixed(2), color: '#6B3A2A' },
    ];
  }, [lotesActivo]);

  // Production by product
  const prodByProduct = useMemo(() => {
    const map: Record<string, number> = {};
    loteProductos.forEach(lp => {
      const lote = lotesActivo.find(l => l.id === lp.lote_id);
      if (!lote) return;
      const prod = productos.find(p => p.id === lp.producto_id);
      if (!prod) return;
      map[prod.nombre] = (map[prod.nombre] || 0) + lp.cantidad_producida;
    });
    return Object.entries(map).map(([name, cantidad]) => ({ name, cantidad })).sort((a, b) => b.cantidad - a.cantidad);
  }, [loteProductos, lotesActivo, productos]);

  // Cost over time
  const costTimeline = useMemo(() => {
    return lotesActivo.map(l => ({
      fecha: l.fecha,
      costo: +l.costo_total.toFixed(2),
      mp: +l.costo_total_mp.toFixed(2),
      elec: +l.costo_total_electricidad.toFixed(2),
    })).sort((a, b) => a.fecha.localeCompare(b.fecha));
  }, [lotesActivo]);

  // Stock status
  const stockStatus = useMemo(() => {
    if (!activo) return [];
    return materias
      .filter(m => m.inventario_id === activo.id)
      .map(m => ({
        name: m.nombre.length > 18 ? m.nombre.slice(0, 18) + '…' : m.nombre,
        stock: m.cantidad_disponible,
        minimo: m.stock_minimo_alerta,
        fill: m.cantidad_disponible <= m.stock_minimo_alerta
          ? (m.cantidad_disponible === 0 ? '#B22222' : '#E65100')
          : '#2E7D32',
      }))
      .sort((a, b) => a.stock - b.stock);
  }, [materias, activo]);

  const totalCost = costBreakdown.reduce((s, c) => s + c.value, 0);
  const hasData = lotesActivo.length > 0;

  return (
    <PageWrapper title="📊 Reportes y Analítica" subtitle="Visualiza datos de producción, costos e inventario">
      {!hasData ? (
        <div className="glass-card p-12 text-center">
          <p className="text-5xl mb-4">📊</p>
          <p className="font-medium text-lg" style={{ color: 'var(--color-gray-medium)' }}>Aún no hay datos de producción</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray-light)' }}>Registra lotes de producción para ver reportes aquí</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1: Cost breakdown + Product ranking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card p-5">
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--color-cacao)' }}>💰 Desglose de Costos</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--color-gray-light)' }}>Total: ${totalCost.toFixed(2)}</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                    paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}>
                    {costBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(196,123,43,0.15)', fontSize: '0.85rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Bar chart - products */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card p-5">
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-cacao)' }}>🏆 Ranking de Producción</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={prodByProduct.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,123,43,0.1)" />
                  <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(196,123,43,0.15)', fontSize: '0.85rem' }} />
                  <Bar dataKey="cantidad" radius={[0, 8, 8, 0]} fill="#C47B2B">
                    {prodByProduct.slice(0, 8).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Row 2: Cost timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-cacao)' }}>📈 Evolución de Costos por Lote</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,123,43,0.1)" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(196,123,43,0.15)', fontSize: '0.85rem' }}
                  formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="costo" name="Costo Total" stroke="#C47B2B" strokeWidth={2.5} dot={{ fill: '#C47B2B', r: 4 }} />
                <Line type="monotone" dataKey="mp" name="Mat. Prima" stroke="#3D1C02" strokeWidth={1.5} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="elec" name="Electricidad" stroke="#6B3A2A" strokeWidth={1.5} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Row 3: Stock status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-cacao)' }}>📦 Estado de Inventario</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stockStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,123,43,0.1)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, angle: -35, textAnchor: 'end' }} height={80} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(196,123,43,0.15)', fontSize: '0.85rem' }} />
                <Bar dataKey="stock" name="Stock Actual" radius={[6, 6, 0, 0]}>
                  {stockStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="minimo" name="Mínimo" fill="rgba(196,123,43,0.2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </PageWrapper>
  );
}
