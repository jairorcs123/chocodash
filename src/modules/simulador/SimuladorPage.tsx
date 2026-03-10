import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRightCircle, BarChart3, GitCompare } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useInventarioStore, useProductosStore } from '../../stores';

type Modo = 'posible' | 'simular' | 'comparar';

export default function SimuladorPage() {
  const activo = useInventarioStore(s => s.getActivo());
  const inventarios = useInventarioStore(s => s.inventarios);
  const getMaterias = useInventarioStore(s => s.getMateriasByInventario);
  const productos = useProductosStore(s => s.productos);
  const recetas = useProductosStore(s => s.recetas);

  const [modo, setModo] = useState<Modo>('posible');
  const [selectedProd, setSelectedProd] = useState('');
  const [cantidad, setCantidad] = useState(100);
  const [compInv1, setCompInv1] = useState('');
  const [compInv2, setCompInv2] = useState('');

  const materias = activo ? getMaterias(activo.id) : [];

  // Mode 1: What can I produce?
  const ranking = useMemo(() => {
    if (!activo) return [];
    return productos.filter(p => p.activo).map(prod => {
      const recetasProd = recetas.filter(r => r.producto_id === prod.id);
      if (recetasProd.length === 0) return { producto: prod, max: 0, limitante: 'Sin receta' };
      let minUnits = Infinity;
      let limitante = '';
      recetasProd.forEach(rec => {
        const mp = materias.find(m => m.nombre === rec.nombre_materia_prima);
        if (!mp || rec.cantidad_por_unidad === 0) return;
        const possible = Math.floor(mp.cantidad_disponible / rec.cantidad_por_unidad);
        if (possible < minUnits) {
          minUnits = possible;
          limitante = rec.nombre_materia_prima;
        }
      });
      return { producto: prod, max: minUnits === Infinity ? 0 : minUnits, limitante };
    }).sort((a, b) => b.max - a.max);
  }, [productos, recetas, materias, activo]);

  // Mode 2: Simulate batch
  const simulacion = useMemo(() => {
    if (!selectedProd || !activo) return null;
    const prod = productos.find(p => p.id === selectedProd);
    if (!prod) return null;
    const recetasProd = recetas.filter(r => r.producto_id === selectedProd);
    const ingredientes = recetasProd.map(rec => {
      const mp = materias.find(m => m.nombre === rec.nombre_materia_prima);
      const necesario = rec.cantidad_por_unidad * cantidad;
      const disponible = mp ? mp.cantidad_disponible : 0;
      const precio = mp ? mp.precio_unitario : 0;
      return {
        nombre: rec.nombre_materia_prima,
        necesario: +necesario.toFixed(4),
        disponible: +disponible.toFixed(4),
        diferencia: +(disponible - necesario).toFixed(4),
        unidad: rec.unidad,
        costo: +(necesario * precio).toFixed(2),
      };
    });
    const costoMP = ingredientes.reduce((s, i) => s + i.costo, 0);
    const costoElec = 15 * activo.precio_kwh * 4; // estimate: 15kW x 4 hours
    const costoMO = 3 * (500 / (22 * 8)) * 4; // 3 workers x 4 hours
    const costoTotal = costoMP + costoElec + costoMO;
    return {
      producto: prod, cantidad, ingredientes, costoMP, costoElec, costoMO, costoTotal,
      costoUnitario: costoTotal / cantidad,
      esViable: ingredientes.every(i => i.diferencia >= 0),
    };
  }, [selectedProd, cantidad, productos, recetas, materias, activo]);

  // Mode 3: Compare inventories
  const comparacion = useMemo(() => {
    if (!compInv1 || !compInv2 || !selectedProd) return null;
    const prod = productos.find(p => p.id === selectedProd);
    if (!prod) return null;
    const recetasProd = recetas.filter(r => r.producto_id === selectedProd);
    const mat1 = getMaterias(compInv1);
    const mat2 = getMaterias(compInv2);
    const invData1 = inventarios.find(i => i.id === compInv1);
    const invData2 = inventarios.find(i => i.id === compInv2);
    if (!invData1 || !invData2) return null;

    const calc = (mats: typeof mat1, invInfo: typeof invData1) => {
      const costoMP = recetasProd.reduce((s, rec) => {
        const mp = mats.find(m => m.nombre === rec.nombre_materia_prima);
        return s + (mp ? rec.cantidad_por_unidad * cantidad * mp.precio_unitario : 0);
      }, 0);
      const costoElec = 15 * invInfo.precio_kwh * 4; // estimate: 15kW x 4 hours
      const costoMO = 3 * (500 / (22 * 8)) * 4; // estimate: 3 workers x 4 hours
      const costoTotal = costoMP + costoElec + costoMO;
      const costoUnitario = costoTotal / cantidad;
      return { costoMP, costoElec, costoMO, costoTotal, costoUnitario };
    };

    return { 
      inv1: invData1, 
      inv2: invData2, 
      datos1: calc(mat1, invData1), 
      datos2: calc(mat2, invData2), 
      producto: prod 
    };
  }, [compInv1, compInv2, selectedProd, cantidad, productos, recetas, getMaterias, inventarios]);

  if (!activo) return (
    <PageWrapper title="🧮 Simulador" subtitle="Simula producciones antes de ejecutarlas">
      <div className="glass-card p-8 text-center">
        <p style={{ color: 'var(--color-gray-medium)' }}>⚠️ Necesitas un inventario activo</p>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper title="🧮 Simulador / Calculadora" subtitle="Calcula antes de producir. Este módulo NO modifica el inventario.">
      {/* Mode selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { id: 'posible', label: '¿Qué puedo producir?', icon: BarChart3 },
          { id: 'simular', label: 'Simular un lote', icon: Calculator },
          { id: 'comparar', label: 'Comparar inventarios', icon: GitCompare },
        ] as const).map(m => (
          <button key={m.id} onClick={() => setModo(m.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer transition-all"
            style={{
              background: modo === m.id ? 'var(--color-cacao)' : 'rgba(196,123,43,0.08)',
              color: modo === m.id ? 'white' : 'var(--color-cacao)',
            }}>
            <m.icon size={14} /> {m.label}
          </button>
        ))}
      </div>

      {/* Mode 1: Ranking */}
      {modo === 'posible' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card overflow-hidden">
            <table className="choco-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Línea</th>
                  <th>Máx. Unidades</th>
                  <th>Ingrediente Limitante</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <motion.tr key={r.producto.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <td className="mono font-bold" style={{ color: i < 3 ? 'var(--color-caramel)' : 'var(--color-gray-light)' }}>
                      {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                    </td>
                    <td className="font-medium">{r.producto.nombre}</td>
                    <td className="capitalize text-xs px-2 py-0.5 rounded-full inline-block"
                      style={{ background: 'rgba(196,123,43,0.08)', color: 'var(--color-mocha)' }}>{r.producto.linea}</td>
                    <td className="mono font-bold text-lg" style={{ color: r.max > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {r.max}
                    </td>
                    <td className="text-sm" style={{ color: 'var(--color-gray-medium)' }}>{r.limitante}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Mode 2: Simulate */}
      {modo === 'simular' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label>Producto</label>
              <select value={selectedProd} onChange={e => setSelectedProd(e.target.value)}>
                <option value="">Seleccionar producto</option>
                {productos.filter(p => p.activo).map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Cantidad a producir</label>
              <input type="number" min="1" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value) || 1)} />
            </div>
          </div>

          {simulacion && (
            <div className="space-y-4">
              {/* Viability */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: simulacion.esViable ? 'rgba(46,125,50,0.1)' : 'rgba(178,34,34,0.1)' }}>
                    {simulacion.esViable ? '✅' : '❌'}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--color-cacao)' }}>{simulacion.producto.nombre}</p>
                    <p className="text-sm" style={{ color: simulacion.esViable ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {simulacion.esViable ? 'Producción viable' : 'Ingredientes insuficientes'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ingredients detail */}
              <div className="glass-card overflow-hidden">
                <table className="choco-table">
                  <thead>
                    <tr><th>Ingrediente</th><th>Necesario</th><th>Disponible</th><th>Diferencia</th><th>Costo</th></tr>
                  </thead>
                  <tbody>
                    {simulacion.ingredientes.map((ing, i) => (
                      <tr key={i}>
                        <td className="font-medium">{ing.nombre}</td>
                        <td className="mono">{ing.necesario} {ing.unidad}</td>
                        <td className="mono">{ing.disponible} {ing.unidad}</td>
                        <td className="mono font-semibold" style={{ color: ing.diferencia >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {ing.diferencia >= 0 ? '+' : ''}{ing.diferencia} {ing.unidad}
                        </td>
                        <td className="mono">${ing.costo.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cost summary */}
              <div className="glass-card p-5">
                <h4 className="font-bold mb-3 text-sm" style={{ color: 'var(--color-cacao)' }}>💰 Desglose de Costos</h4>
                <div className="grid grid-cols-2 gap-2 text-sm max-w-sm">
                  <span style={{ color: 'var(--color-gray-medium)' }}>Materia prima:</span>
                  <span className="text-right font-mono font-semibold">${simulacion.costoMP.toFixed(2)}</span>
                  <span style={{ color: 'var(--color-gray-medium)' }}>Electricidad (est.):</span>
                  <span className="text-right font-mono font-semibold">${simulacion.costoElec.toFixed(2)}</span>
                  <span style={{ color: 'var(--color-gray-medium)' }}>Mano de obra (est.):</span>
                  <span className="text-right font-mono font-semibold">${simulacion.costoMO.toFixed(2)}</span>
                  <span className="font-bold pt-2 border-t" style={{ color: 'var(--color-cacao)' }}>TOTAL:</span>
                  <span className="text-right font-mono font-bold text-lg pt-2 border-t" style={{ color: 'var(--color-caramel)' }}>
                    ${simulacion.costoTotal.toFixed(2)}
                  </span>
                  <span style={{ color: 'var(--color-gray-medium)' }}>Costo unitario:</span>
                  <span className="text-right font-mono" style={{ color: 'var(--color-mocha)' }}>${simulacion.costoUnitario.toFixed(2)}/u</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Mode 3: Compare */}
      {modo === 'comparar' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label>Inventario 1</label>
              <select value={compInv1} onChange={e => setCompInv1(e.target.value)}>
                <option value="">Seleccionar</option>
                {inventarios.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
              </select>
            </div>
            <div>
              <label>Inventario 2</label>
              <select value={compInv2} onChange={e => setCompInv2(e.target.value)}>
                <option value="">Seleccionar</option>
                {inventarios.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
              </select>
            </div>
            <div>
              <label>Producto</label>
              <select value={selectedProd} onChange={e => setSelectedProd(e.target.value)}>
                <option value="">Seleccionar producto</option>
                {productos.filter(p => p.activo).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label>Cantidad a producir</label>
              <input type="number" min="1" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value) || 1)} />
            </div>
          </div>

          {comparacion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { inv: comparacion.inv1, calc: comparacion.datos1, id: 1 },
                { inv: comparacion.inv2, calc: comparacion.datos2, id: 2 },
              ].map(({ inv, calc, id }) => (
                <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: id * 0.1 }}
                  className="glass-card p-5">
                  <h4 className="font-bold mb-4 text-center text-lg" style={{ color: 'var(--color-cacao)', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '0.5rem' }}>{inv.nombre}</h4>
                  <div className="space-y-3 font-mono text-sm max-w-sm mx-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-sans font-medium">Materia prima:</span>
                      <span className="font-bold" style={{ color: 'var(--color-mocha)' }}>${calc.costoMP.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-sans font-medium">Electricidad ({inv.precio_kwh}$/kWh):</span>
                      <span className="font-bold" style={{ color: 'var(--color-mocha)' }}>${calc.costoElec.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-sans font-medium">Mano de obra:</span>
                      <span className="font-bold" style={{ color: 'var(--color-mocha)' }}>${calc.costoMO.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200">
                      <span className="font-sans font-bold text-base" style={{ color: 'var(--color-cacao)' }}>COSTO TOTAL:</span>
                      <span className="font-bold text-xl" style={{ color: 'var(--color-caramel)' }}>${calc.costoTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-xs">
                      <span className="text-gray-500 font-sans">Costo de 1 producto ({inv.nombre}):</span>
                      <span className="font-bold">${calc.costoUnitario.toFixed(2)}/u</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {comparacion.datos1.costoTotal !== comparacion.datos2.costoTotal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="md:col-span-2 glass-card p-4 text-center">
                  <p className="text-base" style={{ color: 'var(--color-cacao)' }}>
                    Diferencia de rentabilidad para <span className="font-bold">{cantidad}u</span> de {comparacion.producto.nombre}: <span className="font-mono font-bold text-xl ml-2" style={{ color: comparacion.datos1.costoTotal < comparacion.datos2.costoTotal ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      ${Math.abs(comparacion.datos1.costoTotal - comparacion.datos2.costoTotal).toFixed(2)}
                    </span>
                    <br/>
                    <span className="text-sm text-gray-500 mt-2 inline-block">({comparacion.datos1.costoTotal < comparacion.datos2.costoTotal ? `El inventario '${comparacion.inv1.nombre}' es más económico` : `El inventario '${comparacion.inv2.nombre}' es más económico`})</span>
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </PageWrapper>
  );
}
