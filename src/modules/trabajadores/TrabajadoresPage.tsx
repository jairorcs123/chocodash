import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, UserCheck, UserX, DollarSign, Clock, X } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useTrabajadoresStore } from '../../stores';
import { Trabajador } from '../../types';

const areaLabels: Record<string, { label: string; emoji: string; color: string }> = {
  produccion: { label: 'Producción', emoji: '🏭', color: 'var(--color-caramel)' },
  limpieza: { label: 'Limpieza', emoji: '🧹', color: '#6B7280' },
  reparto: { label: 'Reparto', emoji: '🚚', color: '#3B82F6' },
  contabilidad: { label: 'Contabilidad', emoji: '📊', color: '#8B5CF6' },
  admin: { label: 'Administración', emoji: '💼', color: '#059669' },
};

export default function TrabajadoresPage() {
  const { trabajadores, agregarTrabajador, actualizarTrabajador, toggleTrabajador, getCostoHora } = useTrabajadoresStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState<string>('todos');
  const [form, setForm] = useState<Omit<Trabajador, 'id'>>({
    nombre: '', cedula: '', area: 'produccion', cargo: '', salario_mensual: 460, horas_jornada_diaria: 8, activo: true,
  });

  const filtered = filterArea === 'todos' ? trabajadores : trabajadores.filter(t => t.area === filterArea);

  const totalSalarios = trabajadores.filter(t => t.activo).reduce((s, t) => s + t.salario_mensual, 0);

  const handleSave = () => {
    if (!form.nombre || !form.cedula) return;
    if (editId) {
      actualizarTrabajador(editId, form);
    } else {
      agregarTrabajador(form);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ nombre: '', cedula: '', area: 'produccion', cargo: '', salario_mensual: 460, horas_jornada_diaria: 8, activo: true });
  };

  const handleEdit = (t: Trabajador) => {
    setForm({ nombre: t.nombre, cedula: t.cedula, area: t.area, cargo: t.cargo, salario_mensual: t.salario_mensual, horas_jornada_diaria: t.horas_jornada_diaria, activo: t.activo });
    setEditId(t.id);
    setShowForm(true);
  };

  return (
    <PageWrapper title="👷 Gestión de Trabajadores" subtitle="Administra el equipo y calcula costos de mano de obra">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Trabajadores Activos', value: trabajadores.filter(t => t.activo).length, icon: UserCheck, color: 'var(--color-success)' },
          { label: 'Nómina Total Mensual', value: `$${totalSalarios.toLocaleString()}`, icon: DollarSign, color: 'var(--color-caramel)' },
          { label: 'Áreas de Trabajo', value: new Set(trabajadores.map(t => t.area)).size, icon: Clock, color: 'var(--color-mocha)' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15`, color: kpi.color }}>
              <kpi.icon size={22} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-gray-medium)' }}>{kpi.label}</p>
              <p className="text-xl font-bold font-mono" style={{ color: 'var(--color-cacao)' }}>{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setEditId(null); setForm({ nombre: '', cedula: '', area: 'produccion', cargo: '', salario_mensual: 460, horas_jornada_diaria: 8, activo: true }); setShowForm(true); }}
          className="px-4 py-2 rounded-xl text-white font-semibold text-sm flex items-center gap-2 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}>
          <Plus size={16} /> Nuevo Trabajador
        </motion.button>
        <div className="flex gap-1">
          {['todos', 'produccion', 'limpieza', 'reparto', 'contabilidad', 'admin'].map(area => (
            <button key={area} onClick={() => setFilterArea(area)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
              style={{
                background: filterArea === area ? 'var(--color-cacao)' : 'rgba(196,123,43,0.06)',
                color: filterArea === area ? 'white' : 'var(--color-gray-medium)',
              }}>
              {area === 'todos' ? '👥 Todos' : `${areaLabels[area]?.emoji} ${areaLabels[area]?.label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Table */}
      <div className="glass-card overflow-hidden">
        <table className="choco-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Área</th>
              <th>Cargo</th>
              <th>Salario</th>
              <th>$/Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <motion.tr key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                style={{ opacity: t.activo ? 1 : 0.5 }}>
                <td className="font-medium">{t.nombre}</td>
                <td className="mono text-xs">{t.cedula}</td>
                <td>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${areaLabels[t.area]?.color}15`, color: areaLabels[t.area]?.color }}>
                    {areaLabels[t.area]?.emoji} {areaLabels[t.area]?.label}
                  </span>
                </td>
                <td>{t.cargo}</td>
                <td className="mono font-semibold">${t.salario_mensual}</td>
                <td className="mono text-sm" style={{ color: 'var(--color-caramel)' }}>${getCostoHora(t.id).toFixed(2)}</td>
                <td>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: t.activo ? 'rgba(46,125,50,0.1)' : 'rgba(178,34,34,0.1)', color: t.activo ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    {t.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(t)} className="p-1.5 rounded-lg cursor-pointer" style={{ color: 'var(--color-caramel)' }}><Edit3 size={14} /></button>
                    <button onClick={() => toggleTrabajador(t.id, !t.activo)} className="p-1.5 rounded-lg cursor-pointer"
                      style={{ color: t.activo ? 'var(--color-danger)' : 'var(--color-success)' }}>
                      {t.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(45,32,18,0.5)' }} onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cacao)' }}>
                  {editId ? 'Editar Trabajador' : 'Nuevo Trabajador'}
                </h3>
                <button onClick={() => setShowForm(false)} className="cursor-pointer" style={{ color: 'var(--color-gray-light)' }}><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div><label>Nombre completo</label><input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} /></div>
                <div><label>Cédula</label><input type="text" value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label>Área</label>
                    <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value as any })}>
                      <option value="produccion">Producción</option>
                      <option value="limpieza">Limpieza</option>
                      <option value="reparto">Reparto</option>
                      <option value="contabilidad">Contabilidad</option>
                      <option value="admin">Administración</option>
                    </select>
                  </div>
                  <div><label>Cargo</label><input type="text" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label>Salario mensual ($)</label><input type="number" value={form.salario_mensual} onChange={e => setForm({ ...form, salario_mensual: parseFloat(e.target.value) || 0 })} /></div>
                  <div><label>Horas/día</label><input type="number" value={form.horas_jornada_diaria} onChange={e => setForm({ ...form, horas_jornada_diaria: parseFloat(e.target.value) || 8 })} /></div>
                </div>
                <button onClick={handleSave} className="w-full py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #C47B2B, #A86820)' }}>
                  {editId ? 'Guardar Cambios' : 'Agregar Trabajador'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
