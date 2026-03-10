import { productosBase, materiasPrimasBase, maquinasBase, trabajadoresBase, generarRecetasBase } from './src/data/seed.js';
import fs from 'fs';
import crypto from 'crypto';

function escapeString(str) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
  if (typeof str === 'number') return str;
  return "'" + str.replace(/'/g, "''") + "'";
}

let sql = `
-- 1. Create Admin User
DO $$
DECLARE
  new_admin_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@chocodash.ec') THEN
    INSERT INTO auth.users (
      id, aud, role, email, raw_user_meta_data, encrypted_password, email_confirmed_at, created_at, updated_at, app_metadata
    ) VALUES (
      new_admin_id,
      'authenticated',
      'authenticated',
      'admin@chocodash.ec',
      '{"full_name":"Administrador ChocoDash"}',
      crypt('chocopassword123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'
    );
    
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      new_admin_id,
      format('{"sub":"%s","email":"%s"}', new_admin_id::text, 'admin@chocodash.ec')::jsonb,
      'email',
      new_admin_id,
      now(),
      now(),
      now()
    );
  END IF;
END $$;
\n`;

const invId = crypto.randomUUID();

sql += `-- 2. Inserción de Inventario Base\n`;
sql += `INSERT INTO inventarios (id, nombre, periodo_inicio, periodo_fin, es_activo, precio_kwh) VALUES (
  '${invId}', 'Inventario Base 2025', '2025-01-01', '2025-12-31', true, 0.089
) ON CONFLICT DO NOTHING;\n\n`;

sql += `-- 3. Productos\n`;
for (const p of productosBase) {
  sql += `INSERT INTO productos (id, nombre, linea, activo) VALUES ('${p.id}', ${escapeString(p.nombre)}, ${escapeString(p.linea)}, ${p.activo}) ON CONFLICT DO NOTHING;\n`;
}
sql += '\n';

sql += `-- 4. Recetas\n`;
const recetas = generarRecetasBase(productosBase);
for (const r of recetas) {
  sql += `INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('${r.id}', '${r.producto_id}', ${escapeString(r.nombre_materia_prima)}, ${r.cantidad_por_unidad}, ${escapeString(r.unidad)}) ON CONFLICT DO NOTHING;\n`;
}
sql += '\n';

sql += `-- 5. Materias Primas\n`;
for (const m of materiasPrimasBase) {
  sql += `INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('${crypto.randomUUID()}', '${invId}', ${escapeString(m.nombre)}, ${escapeString(m.unidad)}, ${m.cantidad_disponible}, ${m.precio_unitario}, ${m.stock_minimo_alerta}) ON CONFLICT DO NOTHING;\n`;
}
sql += '\n';

sql += `-- 6. Maquinas\n`;
for (const m of maquinasBase) {
  sql += `INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('${crypto.randomUUID()}', '${invId}', ${escapeString(m.nombre)}, ${escapeString(m.tipo)}, ${m.potencia_kw}, ${escapeString(m.estado)}, ${escapeString(m.notas)}) ON CONFLICT DO NOTHING;\n`;
}
sql += '\n';

sql += `-- 7. Trabajadores\n`;
for (const t of trabajadoresBase) {
  sql += `INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('${crypto.randomUUID()}', ${escapeString(t.nombre)}, ${escapeString(t.cedula)}, ${escapeString(t.cargo)}, ${escapeString(t.area)}, ${t.salario_mensual}, ${t.horas_jornada_diaria}, ${t.activo}) ON CONFLICT DO NOTHING;\n`;
}
sql += '\n';

fs.writeFileSync('seed.sql', sql);
console.log('Generado seed.sql exitosamente.');
