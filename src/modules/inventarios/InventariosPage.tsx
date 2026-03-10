import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, CheckCircle, Archive, Search, Edit3, Package, AlertTriangle, Cpu, X, Database, Save } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useInventarioStore } from '../../stores';
import { MateriaPrima, Maquina } from '../../types';
import { materiasPrimasBase, maquinasBase } from '../../data/seed';

function StockBadge({ mp }: { mp: MateriaPrima }) {
  if (mp.cantidad_disponible === 0) return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(178,34,34,0.1)', color: 'var(--color-danger)' }}>
      Sin stock
    </span>
  );
  if (mp.cantidad_disponible <= mp.stock_minimo_alerta) return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(230,81,0,0.1)', color: 'var(--color-warning)' }}>
      Stock bajo
    </span>
  );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(46,125,50,0.1)', color: 'var(--color-success)' }}>
      OK
    </span>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    activa: { bg: 'rgba(46,125,50,0.1)', color: 'var(--color-success)' },
    danada: { bg: 'rgba(178,34,34,0.1)', color: 'var(--color-danger)' },
    mantenimiento: { bg: 'rgba(230,81,0,0.1)', color: 'var(--color-warning)' },
  };
  const c = colors[estado] || colors.activa;
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: c.bg, color: c.color }}>
      {estado}
    </span>
  );
}

export default function InventariosPage() {
  const { inventarios, materiasPrimas, maquinas, activarInventario, clonarInventario, crearInventario,
    actualizarMateriaPrima, getMateriasByInventario, getMaquinasByInventario, agregarMateriaPrima, agregarMaquina } = useInventarioStore();
  const [selectedInv, setSelectedInv] = useState<string | null>(null);
  const [tab, setTab] = useState<'materias' | 'maquinas'>('materias');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showClone, setShowClone] = useState<string | null>(null);
  const [newInvName, setNewInvName] = useState('');
  const [newInvInicio, setNewInvInicio] = useState('');
  const [newInvFin, setNewInvFin] = useState('');
  const [newInvKwh, setNewInvKwh] = useState('0.089');
  
  const [showNewMp, setShowNewMp] = useState(false);
  const [showNewMq, setShowNewMq] = useState(false);
  const [editingMp, setEditingMp] = useState<MateriaPrima | null>(null);
  const [editingMq, setEditingMq] = useState<Maquina | null>(null);
  const [newMp, setNewMp] = useState<Partial<MateriaPrima>>({ nombre: '', unidad: 'kg', cantidad_disponible: 0, precio_unitario: 0, stock_minimo_alerta: 5 });
  const [newMq, setNewMq] = useState<Partial<Maquina>>({ nombre: '', tipo: 'temperadora', potencia_kw: 1, estado: 'activa', notas: '' });

  const selectedInventario = inventarios.find(i => i.id === selectedInv);
  const currentMaterias = selectedInv ? getMateriasByInventario(selectedInv) : [];
  const currentMaquinas = selectedInv ? getMaquinasByInventario(selectedInv) : [];

  const filteredMaterias = currentMaterias.filter(mp =>
    mp.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newInvName) return;
    crearInventario({ nombre: newInvName, periodo_inicio: newInvInicio, periodo_fin: newInvFin || null, precio_kwh: parseFloat(newInvKwh) || 0.089 });
    setShowCreate(false);
    setNewInvName('');
  };

  const handleClone = () => {
    if (!showClone || !newInvName) return;
    clonarInventario(showClone, newInvName);
    setShowClone(null);
    setNewInvName('');
  };

  const handleCargarCatalogoMp = () => {
    if (!selectedInv) return;
    const existing = new Set(currentMaterias.map(m => m.nombre));
    materiasPrimasBase.forEach(mp => {
      if (!existing.has(mp.nombre)) {
        agregarMateriaPrima({ ...mp, inventario_id: selectedInv, cantidad_disponible: 0 } as Omit<MateriaPrima, 'id'>);
      }
    });
  };

  const handleCargarCatalogoMq = () => {
    if (!selectedInv) return;
    const existing = new Set(currentMaquinas.map(m => m.nombre));
    maquinasBase.forEach(mq => {
      if (!existing.has(mq.nombre)) {
        agregarMaquina({ ...mq, inventario_id: selectedInv } as Omit<Maquina, 'id'>);
      }
    });
  };

  const handleSaveMp = () => {
    if (!selectedInv || !newMp.nombre) return;
    agregarMateriaPrima({ ...(newMp as Omit<MateriaPrima, 'id'>), inventario_id: selectedInv, fecha_vencimiento: null });
    setShowNewMp(false);
    setNewMp({ nombre: '', unidad: 'kg', cantidad_disponible: 0, precio_unitario: 0, stock_minimo_alerta: 5 });
  };

  const handleUpdateMp = () => {
    if (!editingMp) return;
    actualizarMateriaPrima(editingMp.id, editingMp);
    setEditingMp(null);
  };

  const handleSaveMq = () => {
    if (!selectedInv || !newMq.nombre) return;
    agregarMaquina({ ...(newMq as Omit<Maquina, 'id'>), inventario_id: selectedInv });
    setShowNewMq(false);
    setNewMq({ nombre: '', tipo: 'temperadora', potencia_kw: 1, estado: 'activa', notas: '' });
  };

  const handleUpdateMq = () => {
    if (!editingMq) return;
    useInventarioStore.getState().actualizarMaquina(editingMq.id, editingMq);
    setEditingMq(null);
  };

  return (
    <PageWrapper title="📦 Gestión de Inventarios" subtitle="Administra materias primas, máquinas y períodos de inventario">
      {/* Inventory List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {inventarios.map((inv, i) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelectedInv(inv.id)}
            className="glass-card p-4 cursor-pointer transition-all"
            style={{
              borderColor: selectedInv === inv.id ? 'var(--color-caramel)' : undefined,
              borderWidth: selectedInv === inv.id ? '2px' : undefined,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-cacao)' }}>{inv.nombre}</h3>
              {inv.es_activo && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(46,125,50,0.12)', color: 'var(--color-success)' }}>
                  ● Activo
                </span>
              )}
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--color-gray-medium)' }}>
              {inv.periodo_inicio} — {inv.periodo_fin || 'En curso'}
            </p>
            <div className="flex gap-2">
              {!inv.es_activo && (
                <button onClick={(e) => { e.stopPropagation(); activarInventario(inv.id); }}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                  style={{ background: 'rgba(46,125,50,0.1)', color: 'var(--color-success)' }}>
                  <CheckCircle size={12} /> Activar
                </button>
              )}
              <button onClick={(e) => { e.stopPropagation(); setShowClone(inv.id); }}
                className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                style={{ background: 'rgba(196,123,43,0.1)', color: 'var(--color-caramel)' }}>
                <Copy size={12} /> Clonar
              </button>
            </div>
          </motion.div>
        ))}

        {/* Create New */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: inventarios.length * 0.08 }}
          onClick={() => setShowCreate(true)}
          className="border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
          style={{ borderColor: 'rgba(196,123,43,0.3)', color: 'var(--color-caramel)' }}
          whileHover={{ scale: 1.02 }}
        >
          <Plus size={24} />
          <span className="text-sm font-medium">Nuevo Inventario</span>
        </motion.button>
      </div>

      {/* Selected Inventory Detail */}
      <AnimatePresence>
        {selectedInv && selectedInventario && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(['materias', 'maquinas'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
                  style={{
                    background: tab === t ? 'var(--color-cacao)' : 'rgba(196,123,43,0.08)',
                    color: tab === t ? 'white' : 'var(--color-cacao)',
                  }}>
                  {t === 'materias' ? <Package size={14} /> : <Cpu size={14} />}
                  {t === 'materias' ? 'Materias Primas' : 'Máquinas'}
                </button>
              ))}
            </div>

            {tab === 'materias' && (
              <>
                {/* Search & Actions */}
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                  <div className="relative max-w-sm flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-gray-light)' }} />
                    <input type="text" placeholder="Buscar materia prima..." value={search} onChange={e => setSearch(e.target.value)}
                      className="pl-9 w-full" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleCargarCatalogoMp}
                      className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                      style={{ background: 'rgba(196,123,43,0.1)', color: 'var(--color-caramel)' }}>
                      <Database size={16} /> Catálogo Base
                    </button>
                    <button onClick={() => setShowNewMp(true)}
                      className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-white transition-all cursor-pointer shadow-md"
                      style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}>
                      <Plus size={16} /> Nueva
                    </button>
                  </div>
                </div>

                {/* Materials Table */}
                <div className="glass-card overflow-hidden">
                  <table className="choco-table">
                    <thead>
                      <tr>
                        <th>Materia Prima</th>
                        <th>Stock</th>
                        <th>Unidad</th>
                        <th>Precio Unit.</th>
                        <th>Mín. Alerta</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMaterias.map((mp, i) => (
                        <motion.tr key={mp.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}>
                          <td className="font-medium">{mp.nombre}</td>
                          <td className="mono font-bold" style={{ color: 'var(--color-caramel)' }}>{mp.cantidad_disponible}</td>
                          <td>{mp.unidad}</td>
                          <td className="mono">${mp.precio_unitario.toFixed(2)}</td>
                          <td className="mono">{mp.stock_minimo_alerta}</td>
                          <td><StockBadge mp={mp} /></td>
                          <td>
                            <button onClick={() => setEditingMp({ ...mp })}
                              className="p-1.5 rounded-lg cursor-pointer transition-colors"
                              style={{ color: 'var(--color-caramel)' }}>
                              <Edit3 size={14} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === 'maquinas' && (
              <>
                {/* Actions */}
                <div className="flex justify-end mb-4 gap-2">
                  <button onClick={handleCargarCatalogoMq}
                    className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                    style={{ background: 'rgba(196,123,43,0.1)', color: 'var(--color-caramel)' }}>
                    <Database size={16} /> Catálogo Base
                  </button>
                  <button onClick={() => setShowNewMq(true)}
                    className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-white transition-all cursor-pointer shadow-md"
                    style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}>
                    <Plus size={16} /> Nueva
                  </button>
                </div>

                <div className="glass-card overflow-hidden">
                <table className="choco-table">
                  <thead>
                    <tr>
                      <th>Máquina</th>
                      <th>Tipo</th>
                      <th>Potencia (kW)</th>
                      <th>Estado</th>
                      <th>Notas</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMaquinas.map((m, i) => (
                      <motion.tr key={m.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}>
                        <td className="font-medium">{m.nombre}</td>
                        <td className="capitalize">{m.tipo}</td>
                        <td className="mono">{m.potencia_kw}</td>
                        <td><EstadoBadge estado={m.estado} /></td>
                        <td className="text-sm" style={{ color: 'var(--color-gray-medium)' }}>{m.notas}</td>
                        <td>
                          <button onClick={() => setEditingMq({ ...m })}
                            className="p-1.5 rounded-lg cursor-pointer transition-colors"
                            style={{ color: 'var(--color-caramel)' }}>
                            <Edit3 size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {(showCreate || showClone) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45, 32, 18, 0.5)' }}
            onClick={() => { setShowCreate(false); setShowClone(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>
                  {showClone ? 'Clonar Inventario' : 'Nuevo Inventario'}
                </h3>
                <button onClick={() => { setShowCreate(false); setShowClone(null); }}
                  className="cursor-pointer p-1" style={{ color: 'var(--color-gray-light)' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label>Nombre del período</label>
                  <input type="text" placeholder="Ej: Abril 2025" value={newInvName} onChange={e => setNewInvName(e.target.value)} />
                </div>
                {!showClone && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label>Inicio período</label>
                        <input type="date" value={newInvInicio} onChange={e => setNewInvInicio(e.target.value)} />
                      </div>
                      <div>
                        <label>Fin período</label>
                        <input type="date" value={newInvFin} onChange={e => setNewInvFin(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label>Precio kWh ($)</label>
                      <input type="number" step="0.001" value={newInvKwh} onChange={e => setNewInvKwh(e.target.value)} />
                    </div>
                  </>
                )}
                {showClone && (
                  <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--color-crema)', color: 'var(--color-gray-medium)' }}>
                    💡 Se hará una copia exacta de este inventario, copiando todas tus materias primas, máquinas y el inventario actual (stock) disponible.
                  </p>
                )}
                <button
                  onClick={showClone ? handleClone : handleCreate}
                  className="w-full py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}
                >
                  {showClone ? 'Clonar Inventario' : 'Crear Inventario'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Materia Prima Modal */}
      <AnimatePresence>
        {showNewMp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45, 32, 18, 0.5)' }}
            onClick={() => setShowNewMp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>Nueva Materia Prima</h3>
                <button onClick={() => setShowNewMp(false)} className="cursor-pointer" style={{ color: 'var(--color-gray-light)' }}><X size={20} /></button>
              </div>
              <div className="space-y-3 mb-5">
                <div><label>Nombre</label><input type="text" value={newMp.nombre} onChange={e => setNewMp({ ...newMp, nombre: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label>Unidad</label><input type="text" value={newMp.unidad} onChange={e => setNewMp({ ...newMp, unidad: e.target.value })} /></div>
                  <div><label>Precio Unit. ($)</label><input type="number" step="0.01" value={newMp.precio_unitario} onChange={e => setNewMp({ ...newMp, precio_unitario: parseFloat(e.target.value) || 0 })} /></div>
                  <div><label>Stock Inicial</label><input type="number" value={newMp.cantidad_disponible} onChange={e => setNewMp({ ...newMp, cantidad_disponible: parseFloat(e.target.value) || 0 })} /></div>
                  <div><label>Mínimo Alerta</label><input type="number" value={newMp.stock_minimo_alerta} onChange={e => setNewMp({ ...newMp, stock_minimo_alerta: parseInt(e.target.value) || 0 })} /></div>
                </div>
              </div>
              <button onClick={handleSaveMp} className="w-full py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}><Save size={16} /> Guardar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Maquina Modal */}
      <AnimatePresence>
        {showNewMq && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45, 32, 18, 0.5)' }}
            onClick={() => setShowNewMq(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>Nueva Máquina</h3>
                <button onClick={() => setShowNewMq(false)} className="cursor-pointer" style={{ color: 'var(--color-gray-light)' }}><X size={20} /></button>
              </div>
              <div className="space-y-3 mb-5">
                <div><label>Nombre</label><input type="text" value={newMq.nombre} onChange={e => setNewMq({ ...newMq, nombre: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label>Tipo</label>
                    <select value={newMq.tipo} onChange={e => setNewMq({ ...newMq, tipo: e.target.value })}>
                      <option value="temperadora">Temperadora</option>
                      <option value="refinadora">Refinadora</option>
                      <option value="moldeadora">Moldeadora</option>
                      <option value="selladora">Selladora</option>
                      <option value="refrigeracion">Refrigeración</option>
                      <option value="mezcladora">Mezcladora</option>
                      <option value="tunel">Túnel</option>
                    </select>
                  </div>
                  <div><label>Potencia (kW)</label><input type="number" step="0.1" value={newMq.potencia_kw} onChange={e => setNewMq({ ...newMq, potencia_kw: parseFloat(e.target.value) || 0 })} /></div>
                  <div>
                    <label>Estado</label>
                    <select value={newMq.estado} onChange={e => setNewMq({ ...newMq, estado: e.target.value as any })}>
                      <option value="activa">Activa</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="danada">Dañada</option>
                    </select>
                  </div>
                  <div><label>Notas</label><input type="text" value={newMq.notas} onChange={e => setNewMq({ ...newMq, notas: e.target.value })} /></div>
                </div>
              </div>
              <button onClick={handleSaveMq} className="w-full py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}><Save size={16} /> Guardar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Materia Prima Modal */}
      <AnimatePresence>
        {editingMp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45, 32, 18, 0.5)' }}
            onClick={() => setEditingMp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>Editar Materia Prima</h3>
                <button onClick={() => setEditingMp(null)} className="cursor-pointer" style={{ color: 'var(--color-gray-light)' }}><X size={20} /></button>
              </div>
              <div className="space-y-3 mb-5">
                <div><label>Nombre</label><input type="text" value={editingMp.nombre} onChange={e => setEditingMp({ ...editingMp, nombre: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label>Unidad</label><input type="text" value={editingMp.unidad} onChange={e => setEditingMp({ ...editingMp, unidad: e.target.value })} /></div>
                  <div><label>Precio Unit. ($)</label><input type="number" step="0.01" value={editingMp.precio_unitario} onChange={e => setEditingMp({ ...editingMp, precio_unitario: parseFloat(e.target.value) || 0 })} /></div>
                  <div><label>Stock Actual</label><input type="number" value={editingMp.cantidad_disponible} onChange={e => setEditingMp({ ...editingMp, cantidad_disponible: parseFloat(e.target.value) || 0 })} /></div>
                  <div><label>Mínimo Alerta</label><input type="number" value={editingMp.stock_minimo_alerta} onChange={e => setEditingMp({ ...editingMp, stock_minimo_alerta: parseInt(e.target.value) || 0 })} /></div>
                </div>
              </div>
              <button onClick={handleUpdateMp} className="w-full py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}><Save size={16} /> Guardar Cambios</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Maquina Modal */}
      <AnimatePresence>
        {editingMq && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(45, 32, 18, 0.5)' }}
            onClick={() => setEditingMq(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: 'var(--color-cacao)', fontFamily: 'var(--font-display)' }}>Editar Máquina</h3>
                <button onClick={() => setEditingMq(null)} className="cursor-pointer" style={{ color: 'var(--color-gray-light)' }}><X size={20} /></button>
              </div>
              <div className="space-y-3 mb-5">
                <div><label>Nombre</label><input type="text" value={editingMq.nombre} onChange={e => setEditingMq({ ...editingMq, nombre: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label>Tipo</label>
                    <select value={editingMq.tipo} onChange={e => setEditingMq({ ...editingMq, tipo: e.target.value })}>
                      <option value="temperadora">Temperadora</option>
                      <option value="refinadora">Refinadora</option>
                      <option value="moldeadora">Moldeadora</option>
                      <option value="selladora">Selladora</option>
                      <option value="refrigeracion">Refrigeración</option>
                      <option value="mezcladora">Mezcladora</option>
                      <option value="tunel">Túnel</option>
                    </select>
                  </div>
                  <div><label>Potencia (kW)</label><input type="number" step="0.1" value={editingMq.potencia_kw} onChange={e => setEditingMq({ ...editingMq, potencia_kw: parseFloat(e.target.value) || 0 })} /></div>
                  <div>
                    <label>Estado</label>
                    <select value={editingMq.estado} onChange={e => setEditingMq({ ...editingMq, estado: e.target.value as any })}>
                      <option value="activa">Activa</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="danada">Dañada</option>
                    </select>
                  </div>
                  <div><label>Notas</label><input type="text" value={editingMq.notas} onChange={e => setEditingMq({ ...editingMq, notas: e.target.value })} /></div>
                </div>
              </div>
              <button onClick={handleUpdateMq} className="w-full py-2.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}><Save size={16} /> Guardar Cambios</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PageWrapper>
  );
}
