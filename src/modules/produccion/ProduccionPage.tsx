import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CalendarDays, Save, Trash2, X } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useInventarioStore, useProductosStore, useProduccionStore, useTrabajadoresStore } from '../../stores';

const formatDate = (d: Date) => d.toISOString().split('T')[0];

export default function ProduccionPage() {
  const activo = useInventarioStore(s => s.getActivo());
  const todasMaterias = useInventarioStore(s => s.materiasPrimas);
  const todasMaquinas = useInventarioStore(s => s.maquinas);
  
  const invId = activo?.id || '';
  const materias = useMemo(() => todasMaterias.filter(mp => mp.inventario_id === invId), [todasMaterias, invId]);
  const maquinas = useMemo(() => todasMaquinas.filter(m => m.inventario_id === invId), [todasMaquinas, invId]);
  
  const descontar = useInventarioStore(s => s.descontarMateria);
  const productos = useProductosStore(s => s.productos);
  const recetas = useProductosStore(s => s.recetas);
  const allTrabajadores = useTrabajadoresStore(s => s.trabajadores);
  const getCostoHora = useTrabajadoresStore(s => s.getCostoHora);
  const registrarLote = useProduccionStore(s => s.registrarLote);
  const lotes = useProduccionStore(s => s.lotes);

  const trabajadoresProduccion = allTrabajadores.filter(t => t.area === 'produccion' && t.activo);

  const [fecha, setFecha] = useState(formatDate(new Date()));
  const [turno, setTurno] = useState<string>('manana');
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<{ productoId: string; cantidad: number }[]>([]);
  const [maquinasUsadas, setMaquinasUsadas] = useState<{ maquinaId: string; horas: number }[]>([]);
  const [trabajadoresAsig, setTrabajadoresAsig] = useState<{ trabajadorId: string; horas: number }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  // Calculate costs
  const costoMP = useMemo(() => {
    return items.reduce((total, item) => {
      const recetasProducto = recetas.filter(r => r.producto_id === item.productoId);
      return total + recetasProducto.reduce((sub, rec) => {
        const mp = materias.find(m => m.nombre === rec.nombre_materia_prima);
        return sub + (mp ? rec.cantidad_por_unidad * item.cantidad * mp.precio_unitario : 0);
      }, 0);
    }, 0);
  }, [items, recetas, materias]);

  const costoElectricidad = useMemo(() => {
    if (!activo) return 0;
    return maquinasUsadas.reduce((total, mu) => {
      const maq = maquinas.find(m => m.id === mu.maquinaId);
      return total + (maq ? maq.potencia_kw * mu.horas * activo.precio_kwh : 0);
    }, 0);
  }, [maquinasUsadas, maquinas, activo]);

  const costoManoObra = useMemo(() => {
    return trabajadoresAsig.reduce((total, ta) => {
      return total + getCostoHora(ta.trabajadorId) * ta.horas;
    }, 0);
  }, [trabajadoresAsig, getCostoHora]);

  const costoTotal = costoMP + costoElectricidad + costoManoObra;
  const totalUnidades = items.reduce((s, i) => s + i.cantidad, 0);
  const costoUnitario = totalUnidades > 0 ? costoTotal / totalUnidades : 0;

  const handleSave = () => {
    if (!activo || items.length === 0) return;

    const loteNum = lotes.filter(l => l.fecha === fecha).length + 1;
    const loteCodigo = `LOTE-${fecha.replace(/-/g, '-')}-${String(loteNum).padStart(3, '0')}`;

    // Deduct inventory
    items.forEach(item => {
      const recetasProducto = recetas.filter(r => r.producto_id === item.productoId);
      recetasProducto.forEach(rec => {
        descontar(activo.id, rec.nombre_materia_prima, rec.cantidad_por_unidad * item.cantidad);
      });
    });

    registrarLote(
      {
        inventario_id: activo.id, lote_codigo: loteCodigo, fecha, turno: turno as any,
        observaciones, costo_total_mp: costoMP, costo_total_electricidad: costoElectricidad,
        costo_total_mano_obra: costoManoObra, costo_total: costoTotal, created_by: 'admin',
      },
      items.map(i => ({
        producto_id: i.productoId, cantidad_producida: i.cantidad,
        costo_mp_subtotal: recetas.filter(r => r.producto_id === i.productoId).reduce((s, r) => {
          const mp = materias.find(m => m.nombre === r.nombre_materia_prima);
          return s + (mp ? r.cantidad_por_unidad * i.cantidad * mp.precio_unitario : 0);
        }, 0),
      })),
      maquinasUsadas.map(m => {
        const maq = maquinas.find(ma => ma.id === m.maquinaId);
        return {
          maquina_id: m.maquinaId, horas_uso: m.horas,
          costo_electricidad: maq ? maq.potencia_kw * m.horas * activo.precio_kwh : 0,
        };
      }),
      trabajadoresAsig.map(t => ({
        trabajador_id: t.trabajadorId, horas_trabajadas: t.horas,
        costo_mano_obra: getCostoHora(t.trabajadorId) * t.horas,
      }))
    );

    setSaved(true);
    setTimeout(() => {
      setShowForm(false); setSaved(false);
      setItems([]); setMaquinasUsadas([]); setTrabajadoresAsig([]); setObservaciones('');
    }, 2000);
  };

  const lotesActivo = activo ? lotes.filter(l => l.inventario_id === activo.id).reverse() : [];

  if (!activo) return (
    <PageWrapper title="📋 Registro de Producción" subtitle="Registra la producción diaria">
      <div className="glass-card p-8 text-center">
        <p className="text-lg" style={{ color: 'var(--color-gray-medium)' }}>⚠️ Necesitas un inventario activo para registrar producción</p>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper title="📋 Registro de Producción" subtitle="Registra lotes de producción y calcula costos automáticamente">
      <div className="flex gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
          style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}
        >
          <Plus size={16} /> Nuevo Registro
        </motion.button>
      </div>

      {/* Production History */}
      {lotesActivo.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="choco-table">
            <thead>
              <tr>
                <th>Código de Lote</th>
                <th>Fecha</th>
                <th>Turno</th>
                <th>Costo MP</th>
                <th>Costo Eléc.</th>
                <th>Costo MO</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {lotesActivo.map((l, i) => (
                <motion.tr key={l.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}>
                  <td className="mono font-semibold" style={{ color: 'var(--color-cacao)' }}>{l.lote_codigo}</td>
                  <td>{l.fecha}</td>
                  <td className="capitalize">{l.turno}</td>
                  <td className="mono">${l.costo_total_mp.toFixed(2)}</td>
                  <td className="mono">${l.costo_total_electricidad.toFixed(2)}</td>
                  <td className="mono">${l.costo_total_mano_obra.toFixed(2)}</td>
                  <td className="mono font-bold" style={{ color: 'var(--color-caramel)' }}>${l.costo_total.toFixed(2)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lotesActivo.length === 0 && !showForm && (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium" style={{ color: 'var(--color-gray-medium)' }}>No hay registros aún</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-gray-light)' }}>Crea tu primer registro de producción</p>
        </div>
      )}

      {/* Registration Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-8 overflow-y-auto"
            style={{ background: 'rgba(45, 32, 18, 0.5)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="glass-card p-6 w-full max-w-3xl mx-4 mb-8"
              onClick={e => e.stopPropagation()}
            >
              {saved ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="py-12 text-center">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5 }} className="text-6xl mb-4">✅</motion.div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>¡Lote registrado!</h3>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-gray-medium)' }}>Inventario actualizado automáticamente</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cacao)' }}>
                      Nuevo Registro de Producción
                    </h3>
                    <button onClick={() => setShowForm(false)} className="cursor-pointer" style={{ color: 'var(--color-gray-light)' }}><X size={20} /></button>
                  </div>

                  {/* Date & Shift */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label>Fecha</label>
                      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
                    </div>
                    <div>
                      <label>Turno</label>
                      <select value={turno} onChange={e => setTurno(e.target.value)}>
                        <option value="manana">☀️ Mañana</option>
                        <option value="tarde">🌤️ Tarde</option>
                        <option value="noche">🌙 Noche</option>
                        <option value="continuo">🔄 Continuo</option>
                      </select>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-cacao)' }}>🍫 Productos Producidos</h4>
                    {items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <select value={item.productoId} onChange={e => {
                          const n = [...items]; n[idx].productoId = e.target.value; setItems(n);
                        }} className="flex-1">
                          <option value="">Seleccionar producto</option>
                          {productos.filter(p => p.activo).map(p => (
                            <option key={p.id} value={p.id}>{p.nombre} ({p.formato})</option>
                          ))}
                        </select>
                        <input type="number" min="1" placeholder="Cant." value={item.cantidad || ''}
                          onChange={e => { const n = [...items]; n[idx].cantidad = parseInt(e.target.value) || 0; setItems(n); }}
                          className="w-24" />
                        <button onClick={() => setItems(items.filter((_, i) => i !== idx))}
                          className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => setItems([...items, { productoId: '', cantidad: 0 }])}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 cursor-pointer mt-1"
                      style={{ color: 'var(--color-caramel)', background: 'rgba(196,123,43,0.08)' }}>
                      <Plus size={12} /> Agregar producto
                    </button>
                  </div>

                  {/* Machines */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-cacao)' }}>⚡ Máquinas Utilizadas</h4>
                    {maquinasUsadas.map((mu, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <select value={mu.maquinaId} onChange={e => {
                          const n = [...maquinasUsadas]; n[idx].maquinaId = e.target.value; setMaquinasUsadas(n);
                        }} className="flex-1">
                          <option value="">Seleccionar máquina</option>
                          {maquinas.filter(m => m.estado === 'activa').map(m => (
                            <option key={m.id} value={m.id}>{m.nombre} ({m.potencia_kw} kW)</option>
                          ))}
                        </select>
                        <input type="number" min="0.5" step="0.5" placeholder="Horas" value={mu.horas || ''}
                          onChange={e => { const n = [...maquinasUsadas]; n[idx].horas = parseFloat(e.target.value) || 0; setMaquinasUsadas(n); }}
                          className="w-24" />
                        <button onClick={() => setMaquinasUsadas(maquinasUsadas.filter((_, i) => i !== idx))}
                          className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => setMaquinasUsadas([...maquinasUsadas, { maquinaId: '', horas: 0 }])}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 cursor-pointer mt-1"
                      style={{ color: 'var(--color-caramel)', background: 'rgba(196,123,43,0.08)' }}>
                      <Plus size={12} /> Agregar máquina
                    </button>
                  </div>

                  {/* Workers */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-cacao)' }}>👷 Mano de Obra</h4>
                    {trabajadoresAsig.map((ta, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <select value={ta.trabajadorId} onChange={e => {
                          const n = [...trabajadoresAsig]; n[idx].trabajadorId = e.target.value; setTrabajadoresAsig(n);
                        }} className="flex-1">
                          <option value="">Seleccionar trabajador</option>
                          {trabajadoresProduccion.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre} - {t.cargo}</option>
                          ))}
                        </select>
                        <input type="number" min="1" max="12" placeholder="Horas" value={ta.horas || ''}
                          onChange={e => { const n = [...trabajadoresAsig]; n[idx].horas = parseFloat(e.target.value) || 0; setTrabajadoresAsig(n); }}
                          className="w-24" />
                        <button onClick={() => setTrabajadoresAsig(trabajadoresAsig.filter((_, i) => i !== idx))}
                          className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => setTrabajadoresAsig([...trabajadoresAsig, { trabajadorId: '', horas: 0 }])}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 cursor-pointer mt-1"
                      style={{ color: 'var(--color-caramel)', background: 'rgba(196,123,43,0.08)' }}>
                      <Plus size={12} /> Agregar trabajador
                    </button>
                  </div>

                  {/* Observations */}
                  <div className="mb-5">
                    <label>Observaciones / Incidentes</label>
                    <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)}
                      rows={2} placeholder="Notas del día..."></textarea>
                  </div>

                  {/* Cost Summary */}
                  {items.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="p-4 rounded-xl mb-5" style={{ background: 'var(--color-crema)' }}>
                      <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--color-cacao)' }}>📊 Resumen de Costos</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span style={{ color: 'var(--color-gray-medium)' }}>Materia prima:</span>
                        <span className="text-right font-mono font-semibold">${costoMP.toFixed(2)}</span>
                        <span style={{ color: 'var(--color-gray-medium)' }}>Electricidad:</span>
                        <span className="text-right font-mono font-semibold">${costoElectricidad.toFixed(2)}</span>
                        <span style={{ color: 'var(--color-gray-medium)' }}>Mano de obra:</span>
                        <span className="text-right font-mono font-semibold">${costoManoObra.toFixed(2)}</span>
                        <span className="font-bold pt-2 border-t" style={{ borderColor: 'rgba(196,123,43,0.2)', color: 'var(--color-cacao)' }}>TOTAL:</span>
                        <span className="text-right font-mono font-bold text-lg pt-2 border-t" style={{ borderColor: 'rgba(196,123,43,0.2)', color: 'var(--color-caramel)' }}>
                          ${costoTotal.toFixed(2)}
                        </span>
                        <span style={{ color: 'var(--color-gray-medium)' }}>Costo unitario:</span>
                        <span className="text-right font-mono" style={{ color: 'var(--color-mocha)' }}>${costoUnitario.toFixed(2)}/u</span>
                      </div>
                    </motion.div>
                  )}

                  <button onClick={handleSave}
                    disabled={items.length === 0 || items.some(i => !i.productoId || i.cantidad <= 0)}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}>
                    <Save size={16} /> Registrar Lote
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
