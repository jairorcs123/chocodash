import { Producto, Receta, MateriaPrima, Maquina, Trabajador } from '../types';

const uid = () => crypto.randomUUID();

// ============================================
// PRODUCTOS - Catálogo Completo
// ============================================
export const productosBase: Producto[] = [
  // Línea Clásica
  { id: uid(), nombre: 'Cacao Puro 100%', linea: 'clasica', descripcion: 'Cacao ecuatoriano fino de aroma, sin azúcar ni aditivos', formato: 'Barra 50g / 100g', peso_gr: 80, porcentaje_cacao: 100, precio_venta: 4.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Oscuro Intenso 85%', linea: 'clasica', descripcion: 'Amargo suave con toque de vainilla natural', formato: 'Barra 50g / 80g', peso_gr: 80, porcentaje_cacao: 85, precio_venta: 3.80, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Oscuro Equilibrado 70%', linea: 'clasica', descripcion: 'El clásico oscuro, para los que empiezan', formato: 'Barra 80g', peso_gr: 80, porcentaje_cacao: 70, precio_venta: 3.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Con Leche Clásico', linea: 'clasica', descripcion: 'El favorito de todos, suave y cremoso', formato: 'Barra 80g / Tarro 200g', peso_gr: 80, porcentaje_cacao: 45, precio_venta: 3.20, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Chocolate Blanco Suave', linea: 'clasica', descripcion: 'Base de manteca de cacao, sin amargor', formato: 'Barra 60g', peso_gr: 60, porcentaje_cacao: 0, precio_venta: 3.00, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Caramelo Salado', linea: 'clasica', descripcion: 'Ganache de caramelo con fleur de sel', formato: 'Barra rellena 75g', peso_gr: 75, porcentaje_cacao: 40, precio_venta: 4.00, es_temporada: false, activo: true },

  // Línea Premium Ecuador
  { id: uid(), nombre: 'Maracuyá Explosivo', linea: 'premium', descripcion: 'Chocolate oscuro 65% con relleno ácido de maracuyá', formato: 'Barra rellena 70g', peso_gr: 70, porcentaje_cacao: 65, precio_venta: 5.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Guanábana & Blanco', linea: 'premium', descripcion: 'Chocolate blanco con pulpa de guanábana amazónica', formato: 'Barra 60g', peso_gr: 60, porcentaje_cacao: 0, precio_venta: 5.00, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Naranjilla Andina', linea: 'premium', descripcion: 'Fusión de naranjilla ecuatoriana y cacao 60%', formato: 'Bombón caja x12', peso_gr: 15, porcentaje_cacao: 60, precio_venta: 12.00, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Taxo & Pimienta Rosa', linea: 'premium', descripcion: 'Frutal, atrevido, con toque especiado del Azuay', formato: 'Bombón exclusivo x6', peso_gr: 15, porcentaje_cacao: 55, precio_venta: 9.00, es_temporada: true, activo: true },
  { id: uid(), nombre: 'Toronjil Místico', linea: 'premium', descripcion: 'Chocolate negro 72% con hierba toronjil andina', formato: 'Barra 50g', peso_gr: 50, porcentaje_cacao: 72, precio_venta: 5.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Passionfruit Dreams', linea: 'premium', descripcion: 'Versión premium de maracuyá con capa crocante', formato: 'Barra premium 80g', peso_gr: 80, porcentaje_cacao: 60, precio_venta: 6.50, es_temporada: false, activo: true },

  // Línea Especial / Signature
  { id: uid(), nombre: 'Fresa Explosiva ⭐', linea: 'especial', descripcion: 'Chocolate con leche + cristales de fresa liofilizada + pop rocks comestibles', formato: 'Barra 70g', peso_gr: 70, porcentaje_cacao: 45, precio_venta: 5.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Peanut Butter Crunch ⭐', linea: 'especial', descripcion: 'Chocolate oscuro 65% + mantequilla de maní artesanal + galleta crocante triturada', formato: 'Barra 80g', peso_gr: 80, porcentaje_cacao: 65, precio_venta: 5.80, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Dubai Style ⭐', linea: 'especial', descripcion: 'Inspirado en el viral: kataifi tostado, pistacho, tahini y chocolate con leche', formato: 'Barra 100g', peso_gr: 100, porcentaje_cacao: 45, precio_venta: 8.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Coco Crocante Blanco', linea: 'especial', descripcion: 'Chocolate blanco + coco tostado + arroz inflado', formato: 'Bolitas x10 / Barra 70g', peso_gr: 70, porcentaje_cacao: 0, precio_venta: 4.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Brownie en Barra', linea: 'especial', descripcion: 'Sabor intenso a brownie horneado, textura densa y húmeda', formato: 'Barra 90g', peso_gr: 90, porcentaje_cacao: 55, precio_venta: 4.80, es_temporada: false, activo: true },
  { id: uid(), nombre: "S'mores Ecuatoriano", linea: 'especial', descripcion: 'Chocolate negro + galleta de maíz artesanal + malvavisco', formato: 'Barra 80g', peso_gr: 80, porcentaje_cacao: 65, precio_venta: 5.20, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Mango Biche & Ají', linea: 'especial', descripcion: 'Chocolate blanco con mango verde liofilizado y toque de ají', formato: 'Bombón x8', peso_gr: 15, porcentaje_cacao: 0, precio_venta: 7.50, es_temporada: true, activo: true },
  { id: uid(), nombre: 'Chips Crocante Oscuro', linea: 'especial', descripcion: 'Chocolate 70% en chips pequeños, bolsa premium', formato: 'Bolsa 120g', peso_gr: 120, porcentaje_cacao: 70, precio_venta: 5.00, es_temporada: false, activo: true },

  // Línea Saludable / Funcional
  { id: uid(), nombre: 'Sin Azúcar Stevia', linea: 'saludable', descripcion: 'Chocolate con leche endulzado con stevia natural', formato: 'Barra 60g', peso_gr: 60, porcentaje_cacao: 45, precio_venta: 4.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Proteico Quinua', linea: 'saludable', descripcion: 'Chocolate oscuro + proteína de quinua ecuatoriana', formato: 'Barra 70g', peso_gr: 70, porcentaje_cacao: 55, precio_venta: 5.00, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Granola Andina Choco', linea: 'saludable', descripcion: 'Chocolate negro con granola + semillas de chía y linaza', formato: 'Barra 85g', peso_gr: 85, porcentaje_cacao: 60, precio_venta: 5.20, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Oscuro Cero Azúcar', linea: 'saludable', descripcion: '100% natural, sin ningún endulzante añadido', formato: 'Barra 50g', peso_gr: 50, porcentaje_cacao: 80, precio_venta: 4.80, es_temporada: false, activo: true },

  // Otros Formatos
  { id: uid(), nombre: 'Crema Choco Clásica', linea: 'formato', descripcion: 'Tipo Nutella artesanal, sabor clásico', formato: 'Tarro 200g', peso_gr: 200, porcentaje_cacao: 30, precio_venta: 6.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Paleta Chocolateada', linea: 'formato', descripcion: 'Paleta bañada en cobertura de chocolate', formato: 'Paleta individual', peso_gr: 60, porcentaje_cacao: 40, precio_venta: 2.50, es_temporada: true, activo: true },
  { id: uid(), nombre: 'Bombones Gift Box', linea: 'formato', descripcion: 'Caja de bombones surtidos, presentación premium', formato: 'Caja x12', peso_gr: 180, porcentaje_cacao: 50, precio_venta: 18.00, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Cacao en Polvo', linea: 'formato', descripcion: 'Subproducto procesado, ideal para cocina o bebidas', formato: 'Funda 250g', peso_gr: 250, porcentaje_cacao: 100, precio_venta: 5.50, es_temporada: false, activo: true },
  { id: uid(), nombre: 'Kit Regalo Surtido', linea: 'formato', descripcion: '3–5 barras surtidas en caja diseñada con ribbon', formato: 'Kit x5 barras', peso_gr: 400, porcentaje_cacao: null, precio_venta: 22.00, es_temporada: true, activo: true },
];

// ============================================
// MATERIAS PRIMAS PRECARGADAS
// ============================================
export const materiasPrimasBase: Omit<MateriaPrima, 'id' | 'inventario_id'>[] = [
  { nombre: 'Pasta/licor de cacao', unidad: 'kg', cantidad_disponible: 50, precio_unitario: 5.20, stock_minimo_alerta: 10, fecha_vencimiento: null },
  { nombre: 'Manteca de cacao', unidad: 'kg', cantidad_disponible: 25, precio_unitario: 9.50, stock_minimo_alerta: 5, fecha_vencimiento: null },
  { nombre: 'Azúcar blanca', unidad: 'kg', cantidad_disponible: 100, precio_unitario: 0.72, stock_minimo_alerta: 20, fecha_vencimiento: null },
  { nombre: 'Leche en polvo', unidad: 'kg', cantidad_disponible: 40, precio_unitario: 5.00, stock_minimo_alerta: 10, fecha_vencimiento: null },
  { nombre: 'Cobertura chocolate importada', unidad: 'kg', cantidad_disponible: 30, precio_unitario: 7.00, stock_minimo_alerta: 10, fecha_vencimiento: null },
  { nombre: 'Coco rallado tostado', unidad: 'kg', cantidad_disponible: 15, precio_unitario: 4.20, stock_minimo_alerta: 5, fecha_vencimiento: null },
  { nombre: 'Maní / mantequilla de maní', unidad: 'kg', cantidad_disponible: 12, precio_unitario: 3.80, stock_minimo_alerta: 5, fecha_vencimiento: null },
  { nombre: 'Pistacho pelado', unidad: 'kg', cantidad_disponible: 8, precio_unitario: 22.00, stock_minimo_alerta: 3, fecha_vencimiento: null },
  { nombre: 'Fresa liofilizada', unidad: 'kg', cantidad_disponible: 5, precio_unitario: 25.00, stock_minimo_alerta: 2, fecha_vencimiento: null },
  { nombre: 'Maracuyá pulpa congelada', unidad: 'kg', cantidad_disponible: 15, precio_unitario: 3.00, stock_minimo_alerta: 5, fecha_vencimiento: null },
  { nombre: 'Kataifi (fideos crujientes)', unidad: 'kg', cantidad_disponible: 6, precio_unitario: 12.00, stock_minimo_alerta: 3, fecha_vencimiento: null },
  { nombre: 'Tahini (pasta de sésamo)', unidad: 'kg', cantidad_disponible: 5, precio_unitario: 8.50, stock_minimo_alerta: 3, fecha_vencimiento: null },
  { nombre: 'Vainilla extracto natural', unidad: 'litro', cantidad_disponible: 2, precio_unitario: 28.00, stock_minimo_alerta: 0.5, fecha_vencimiento: null },
  { nombre: 'Stevia en polvo', unidad: 'kg', cantidad_disponible: 3, precio_unitario: 35.00, stock_minimo_alerta: 2, fecha_vencimiento: null },
  { nombre: 'Lecitina de soya', unidad: 'kg', cantidad_disponible: 8, precio_unitario: 6.50, stock_minimo_alerta: 3, fecha_vencimiento: null },
  { nombre: 'Arroz inflado / crispi', unidad: 'kg', cantidad_disponible: 10, precio_unitario: 4.00, stock_minimo_alerta: 5, fecha_vencimiento: null },
  { nombre: 'Pop rocks comestibles', unidad: 'kg', cantidad_disponible: 2, precio_unitario: 45.00, stock_minimo_alerta: 1, fecha_vencimiento: null },
  { nombre: 'Empaques (film + etiqueta)', unidad: 'unidad', cantidad_disponible: 2000, precio_unitario: 0.13, stock_minimo_alerta: 500, fecha_vencimiento: null },
  { nombre: 'Cajas cartón gift box', unidad: 'unidad', cantidad_disponible: 200, precio_unitario: 0.85, stock_minimo_alerta: 100, fecha_vencimiento: null },
  { nombre: 'Tarros de vidrio 200g', unidad: 'unidad', cantidad_disponible: 150, precio_unitario: 0.70, stock_minimo_alerta: 100, fecha_vencimiento: null },
];

// ============================================
// MAQUINARIA PRECARGADA
// ============================================
export const maquinasBase: Omit<Maquina, 'id' | 'inventario_id'>[] = [
  { nombre: 'Temperadora #1', tipo: 'temperadora', potencia_kw: 2.0, estado: 'activa', notas: 'Capacidad 10 kg/batch' },
  { nombre: 'Temperadora #2', tipo: 'temperadora', potencia_kw: 2.5, estado: 'activa', notas: 'Capacidad 15 kg/batch' },
  { nombre: 'Refinadora / Molino de bolas', tipo: 'refinadora', potencia_kw: 5.0, estado: 'activa', notas: 'Capacidad 20 kg/batch' },
  { nombre: 'Túnel de enfriamiento', tipo: 'tunel', potencia_kw: 3.0, estado: 'activa', notas: 'Continuo ~60 u/min' },
  { nombre: 'Moldeadora semiautomática', tipo: 'moldeadora', potencia_kw: 1.5, estado: 'activa', notas: '300 u/hora' },
  { nombre: 'Envolvedora / Selladora', tipo: 'selladora', potencia_kw: 1.0, estado: 'activa', notas: '45 u/min' },
  { nombre: 'Cámara de refrigeración', tipo: 'refrigeracion', potencia_kw: 1.5, estado: 'activa', notas: '24h continuo' },
  { nombre: 'Mezcladora industrial', tipo: 'mezcladora', potencia_kw: 2.0, estado: 'activa', notas: 'Capacidad 30 kg/batch' },
];

// ============================================
// TRABAJADORES REFERENCIA
// ============================================
export const trabajadoresBase: Omit<Trabajador, 'id'>[] = [
  { nombre: 'Carlos Mendoza', cedula: '0102345678', area: 'produccion', cargo: 'Operario Senior', salario_mensual: 520, horas_jornada_diaria: 8, activo: true },
  { nombre: 'María Fernanda López', cedula: '0103456789', area: 'produccion', cargo: 'Operaria', salario_mensual: 480, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Luis Alberto Ríos', cedula: '0104567890', area: 'produccion', cargo: 'Operario', salario_mensual: 480, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Ana Sofía Paredes', cedula: '0105678901', area: 'produccion', cargo: 'Operaria', salario_mensual: 460, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Pedro Chávez', cedula: '0106789012', area: 'produccion', cargo: 'Supervisor de Planta', salario_mensual: 750, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Rosa Campoverde', cedula: '0107890123', area: 'contabilidad', cargo: 'Contadora', salario_mensual: 850, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Jorge Espinoza', cedula: '0108901234', area: 'reparto', cargo: 'Repartidor', salario_mensual: 480, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Carmen Vélez', cedula: '0109012345', area: 'limpieza', cargo: 'Limpieza', salario_mensual: 460, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Diego Morocho', cedula: '0110123456', area: 'produccion', cargo: 'Operario', salario_mensual: 480, horas_jornada_diaria: 8, activo: true },
  { nombre: 'Gabriela Serrano', cedula: '0111234567', area: 'admin', cargo: 'Administradora', salario_mensual: 900, horas_jornada_diaria: 8, activo: true },
];

// ============================================
// RECETAS BASE (cantidades por 1 unidad producida, en kg)
// ============================================
export function generarRecetasBase(productos: Producto[]): Receta[] {
  const recetas: Receta[] = [];
  const r = (prodNombre: string, items: { mp: string; cant: number; unidad: string }[]) => {
    const prod = productos.find(p => p.nombre === prodNombre);
    if (!prod) return;
    items.forEach(item => {
      recetas.push({
        id: uid(),
        producto_id: prod.id,
        nombre_materia_prima: item.mp,
        cantidad_por_unidad: item.cant,
        unidad: item.unidad,
      });
    });
  };

  // Clásica
  r('Cacao Puro 100%', [
    { mp: 'Pasta/licor de cacao', cant: 0.070, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.010, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Oscuro Intenso 85%', [
    { mp: 'Pasta/licor de cacao', cant: 0.055, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.012, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.010, unidad: 'kg' },
    { mp: 'Vainilla extracto natural', cant: 0.001, unidad: 'litro' },
    { mp: 'Lecitina de soya', cant: 0.002, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Oscuro Equilibrado 70%', [
    { mp: 'Pasta/licor de cacao', cant: 0.040, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.015, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.020, unidad: 'kg' },
    { mp: 'Lecitina de soya', cant: 0.002, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Con Leche Clásico', [
    { mp: 'Pasta/licor de cacao', cant: 0.025, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.015, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.025, unidad: 'kg' },
    { mp: 'Leche en polvo', cant: 0.012, unidad: 'kg' },
    { mp: 'Lecitina de soya', cant: 0.002, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Chocolate Blanco Suave', [
    { mp: 'Manteca de cacao', cant: 0.025, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.020, unidad: 'kg' },
    { mp: 'Leche en polvo', cant: 0.012, unidad: 'kg' },
    { mp: 'Vainilla extracto natural', cant: 0.001, unidad: 'litro' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Caramelo Salado', [
    { mp: 'Pasta/licor de cacao', cant: 0.020, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.012, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.020, unidad: 'kg' },
    { mp: 'Leche en polvo', cant: 0.008, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);

  // Premium
  r('Maracuyá Explosivo', [
    { mp: 'Pasta/licor de cacao', cant: 0.035, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.010, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.012, unidad: 'kg' },
    { mp: 'Maracuyá pulpa congelada', cant: 0.015, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Dubai Style ⭐', [
    { mp: 'Pasta/licor de cacao', cant: 0.025, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.015, unidad: 'kg' },
    { mp: 'Leche en polvo', cant: 0.015, unidad: 'kg' },
    { mp: 'Pistacho pelado', cant: 0.020, unidad: 'kg' },
    { mp: 'Kataifi (fideos crujientes)', cant: 0.015, unidad: 'kg' },
    { mp: 'Tahini (pasta de sésamo)', cant: 0.010, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Fresa Explosiva ⭐', [
    { mp: 'Pasta/licor de cacao', cant: 0.022, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.010, unidad: 'kg' },
    { mp: 'Leche en polvo', cant: 0.010, unidad: 'kg' },
    { mp: 'Fresa liofilizada', cant: 0.008, unidad: 'kg' },
    { mp: 'Pop rocks comestibles', cant: 0.005, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Peanut Butter Crunch ⭐', [
    { mp: 'Pasta/licor de cacao', cant: 0.035, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.010, unidad: 'kg' },
    { mp: 'Maní / mantequilla de maní', cant: 0.020, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.010, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Coco Crocante Blanco', [
    { mp: 'Manteca de cacao', cant: 0.020, unidad: 'kg' },
    { mp: 'Azúcar blanca', cant: 0.015, unidad: 'kg' },
    { mp: 'Leche en polvo', cant: 0.010, unidad: 'kg' },
    { mp: 'Coco rallado tostado', cant: 0.015, unidad: 'kg' },
    { mp: 'Arroz inflado / crispi', cant: 0.008, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);
  r('Sin Azúcar Stevia', [
    { mp: 'Pasta/licor de cacao', cant: 0.025, unidad: 'kg' },
    { mp: 'Manteca de cacao', cant: 0.015, unidad: 'kg' },
    { mp: 'Leche en polvo', cant: 0.012, unidad: 'kg' },
    { mp: 'Stevia en polvo', cant: 0.003, unidad: 'kg' },
    { mp: 'Empaques (film + etiqueta)', cant: 1, unidad: 'unidad' },
  ]);

  return recetas;
}
