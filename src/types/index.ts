// ============================================
// ChocoDash Type Definitions
// ============================================

export type UserRole = 'admin' | 'contador' | 'supervisor';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  created_at: string;
}

export interface Inventario {
  id: string;
  nombre: string;
  periodo_inicio: string;
  periodo_fin: string | null;
  precio_kwh: number;
  es_activo: boolean;
  clonado_de: string | null;
  created_at: string;
}

export interface MateriaPrima {
  id: string;
  inventario_id: string;
  nombre: string;
  unidad: string;
  cantidad_disponible: number;
  precio_unitario: number;
  stock_minimo_alerta: number;
  fecha_vencimiento: string | null;
}

export interface Maquina {
  id: string;
  inventario_id: string;
  nombre: string;
  tipo: string;
  potencia_kw: number;
  estado: 'activa' | 'danada' | 'mantenimiento';
  notas: string;
}

export interface Producto {
  id: string;
  nombre: string;
  linea: 'clasica' | 'premium' | 'especial' | 'saludable' | 'formato';
  descripcion: string;
  formato: string;
  peso_gr: number;
  porcentaje_cacao: number | null;
  precio_venta: number;
  es_temporada: boolean;
  activo: boolean;
}

export interface Receta {
  id: string;
  producto_id: string;
  nombre_materia_prima: string;
  cantidad_por_unidad: number;
  unidad: string;
}

export interface LoteProduccion {
  id: string;
  inventario_id: string;
  lote_codigo: string;
  fecha: string;
  turno: 'manana' | 'tarde' | 'noche' | 'continuo';
  observaciones: string;
  costo_total_mp: number;
  costo_total_electricidad: number;
  costo_total_mano_obra: number;
  costo_total: number;
  created_by: string;
  created_at: string;
}

export interface LoteProducto {
  id: string;
  lote_id: string;
  producto_id: string;
  cantidad_producida: number;
  costo_mp_subtotal: number;
}

export interface LoteMaquinaUsada {
  id: string;
  lote_id: string;
  maquina_id: string;
  horas_uso: number;
  costo_electricidad: number;
}

export interface Trabajador {
  id: string;
  nombre: string;
  cedula: string;
  area: 'produccion' | 'limpieza' | 'reparto' | 'contabilidad' | 'admin';
  cargo: string;
  salario_mensual: number;
  horas_jornada_diaria: number;
  activo: boolean;
}

export interface LoteTrabajador {
  id: string;
  lote_id: string;
  trabajador_id: string;
  horas_trabajadas: number;
  costo_mano_obra: number;
}

// Simulador types
export interface SimulacionResultado {
  producto: Producto;
  cantidad: number;
  ingredientes: {
    nombre: string;
    necesario: number;
    disponible: number;
    diferencia: number;
    unidad: string;
    costo: number;
  }[];
  costo_mp: number;
  costo_electricidad: number;
  costo_mano_obra: number;
  costo_total: number;
  costo_unitario: number;
  es_viable: boolean;
}

export interface ProduccionPosible {
  producto: Producto;
  max_unidades: number;
  ingrediente_limitante: string;
}
