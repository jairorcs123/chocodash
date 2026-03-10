import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import { productosBase, materiasPrimasBase, maquinasBase, trabajadoresBase, generarRecetasBase } from './src/data/seed.js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. RLS is currently disabled on the backend. No authentication needed to insert.
    console.log('✅ Bypassing auth because RLS is disabled.');

    // 2. Insert Productos
    fs.appendFileSync('debug.log', `📦 Inserting ${productosBase.length} productos...\n`);
    const resProd = await supabase.from('productos').insert(
      productosBase.map(p => ({
        id: p.id,
        nombre: p.nombre,
        linea: p.linea,
        activo: p.activo
      }))
    );
    fs.appendFileSync('debug.log', `📦 Productos Insert Response: ${JSON.stringify(resProd, null, 2)}\n`);
    if (resProd.error) throw new Error(`Productos error: ${resProd.error.message}`);

    // 3. Insert Recetas
    const recetasBase = generarRecetasBase(productosBase);
    console.log(`📜 Inserting ${recetasBase.length} recetas...`);
    const { error: errRecetas } = await supabase.from('recetas').insert(
      recetasBase.map(r => ({
        id: r.id,
        producto_id: r.producto_id,
        nombre_materia_prima: r.nombre_materia_prima,
        cantidad_por_unidad: r.cantidad_por_unidad,
        unidad: r.unidad
      }))
    );
    if (errRecetas) throw new Error(`Recetas error: ${errRecetas.message}`);

    // 4. Create Initial Inventory
    console.log(`📋 Creating initial inventory...`);
    const invId = crypto.randomUUID();
    const { error: errInv } = await supabase.from('inventarios').insert({
      id: invId,
      nombre: 'Inventario Base 2025',
      periodo_inicio: '2025-01-01',
      periodo_fin: '2025-12-31',
      precio_kwh: 0.089,
      es_activo: true
    });
    if (errInv) throw new Error(`Inventarios error: ${errInv.message}`);

    // 5. Insert Materias Primas into that inventory
    console.log(`🥜 Inserting ${materiasPrimasBase.length} materias primas...`);
    const { error: errMat } = await supabase.from('materias_primas').insert(
      materiasPrimasBase.map(m => ({
        id: crypto.randomUUID(),
        inventario_id: invId,
        nombre: m.nombre,
        unidad: m.unidad,
        precio_unitario: m.precio_unitario,
        cantidad_disponible: m.cantidad_disponible,
        stock_minimo_alerta: m.stock_minimo_alerta,
        fecha_vencimiento: m.fecha_vencimiento
      }))
    );
    if (errMat) throw new Error(`Materias error: ${errMat.message}`);

    // 6. Insert Maquinas
    console.log(`⚙️ Inserting ${maquinasBase.length} maquinas...`);
    const { error: errMaq } = await supabase.from('maquinas').insert(
      maquinasBase.map(m => ({
        id: crypto.randomUUID(),
        inventario_id: invId,
        nombre: m.nombre,
        tipo: m.tipo,
        potencia_kw: m.potencia_kw,
        estado: m.estado,
        notas: m.notas
      }))
    );
    if (errMaq) throw new Error(`Maquinas error: ${errMaq.message}`);

    // 7. Insert Trabajadores
    console.log(`👷 Inserting ${trabajadoresBase.length} trabajadores...`);
    const { error: errTrab } = await supabase.from('trabajadores').insert(
      trabajadoresBase.map((t, idx) => ({
        id: crypto.randomUUID(),
        nombre: t.nombre,
        cargo: t.cargo,
        area: t.area,
        salario_mensual: t.salario_mensual,
        dias_laborales_mes: 22,
        horas_diarias: t.horas_jornada_diaria,
        activo: t.activo
      }))
    );
    if (errTrab) throw new Error(`Trabajadores error: ${errTrab.message}`);


    fs.appendFileSync('debug.log', '🎉 Seeding completed successfully!\n');
  } catch (error) {
    fs.appendFileSync('debug.log', `❌ Seeding failed: ${error.stack}\n`);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
