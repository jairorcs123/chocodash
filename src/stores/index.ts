import { create } from 'zustand';
import { Inventario, MateriaPrima, Maquina, Producto, Receta, LoteProduccion, Trabajador, LoteProducto, LoteMaquinaUsada, LoteTrabajador } from '../types';
import { productosBase, materiasPrimasBase, maquinasBase, trabajadoresBase, generarRecetasBase } from '../data/seed';
import { supabase } from '../supabase/client';

const uid = () => crypto.randomUUID();

// Initialize seed data
const seedProductos = productosBase;
const seedRecetas = generarRecetasBase(seedProductos);

// Default inventory for fallback if needed
const defaultInventarioId = uid();
const defaultInventario: Inventario = {
  id: defaultInventarioId,
  nombre: 'Marzo 2025',
  periodo_inicio: '2025-03-01',
  periodo_fin: '2025-03-31',
  precio_kwh: 0.089,
  es_activo: true,
  clonado_de: null,
  created_at: new Date().toISOString(),
};

const defaultMaterias: MateriaPrima[] = materiasPrimasBase.map(mp => ({
  ...mp,
  id: uid(),
  inventario_id: defaultInventarioId,
}));

const defaultMaquinas: Maquina[] = maquinasBase.map(m => ({
  ...m,
  id: uid(),
  inventario_id: defaultInventarioId,
}));

const defaultTrabajadores: Trabajador[] = trabajadoresBase.map(t => ({
  ...t,
  id: uid(),
}));
// AUTH STORE
// ============================================
interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string; nombre: string; rol: string } | null;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({
        isAuthenticated: true,
        user: { 
          id: session.user.id, 
          email: session.user.email || '', 
          nombre: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario', 
          rol: 'admin' 
        },
        loading: false
      });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          isAuthenticated: true,
          user: { 
            id: session.user.id, 
            email: session.user.email || '', 
            nombre: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario', 
            rol: 'admin' 
          },
        });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    });
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },
}));

// ============================================
// INVENTARIO STORE
// ============================================
interface InventarioState {
  inventarios: Inventario[];
  materiasPrimas: MateriaPrima[];
  maquinas: Maquina[];
  fetching: boolean;
  initialize: () => Promise<void>;
  getActivo: () => Inventario | undefined;
  getMateriasByInventario: (invId: string) => MateriaPrima[];
  getMaquinasByInventario: (invId: string) => Maquina[];
  crearInventario: (inv: Omit<Inventario, 'id' | 'created_at' | 'es_activo' | 'clonado_de'>) => Promise<void>;
  activarInventario: (id: string) => Promise<void>;
  clonarInventario: (id: string, nuevoNombre: string) => Promise<void>;
  actualizarMateriaPrima: (id: string, updates: Partial<MateriaPrima>) => Promise<void>;
  actualizarMaquina: (id: string, updates: Partial<Maquina>) => Promise<void>;
  descontarMateria: (inventarioId: string, nombreMp: string, cantidad: number) => Promise<void>;
  agregarMateriaPrima: (mp: Omit<MateriaPrima, 'id'>) => Promise<void>;
  agregarMaquina: (m: Omit<Maquina, 'id'>) => Promise<void>;
}

export const useInventarioStore = create<InventarioState>((set, get) => ({
  inventarios: [],
  materiasPrimas: [],
  maquinas: [],
  fetching: false,

  initialize: async () => {
    set({ fetching: true });
    
    // Fetch Todo en paralelo
    const [invRes, matRes, maqRes] = await Promise.all([
      supabase.from('inventarios').select('*').order('created_at', { ascending: false }),
      supabase.from('materias_primas').select('*'),
      supabase.from('maquinas').select('*'),
    ]);

    set({
      inventarios: invRes.data || [],
      materiasPrimas: matRes.data || [],
      maquinas: maqRes.data || [],
      fetching: false
    });
  },

  getActivo: () => get().inventarios.find(i => i.es_activo),

  getMateriasByInventario: (invId: string) =>
    get().materiasPrimas.filter(mp => mp.inventario_id === invId),

  getMaquinasByInventario: (invId: string) =>
    get().maquinas.filter(m => m.inventario_id === invId),

  crearInventario: async (inv) => {
    const newInv: Inventario = {
      ...inv, id: uid(), es_activo: false, clonado_de: null, created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('inventarios').insert(newInv);
    if (!error) {
      set(state => ({ inventarios: [...state.inventarios, newInv] }));
    } else {
      console.error('Error creando inventario:', error.message);
    }
  },

  activarInventario: async (id: string) => {
    // La DB tiene un trigger que se encarga de desactivar los demás
    const { error } = await supabase.from('inventarios').update({ es_activo: true }).eq('id', id);
    if (!error) {
      set(state => ({
        inventarios: state.inventarios.map(i => ({ ...i, es_activo: i.id === id })),
      }));
    } else {
      console.error('Error activando inventario:', error.message);
    }
  },

  clonarInventario: async (id: string, nuevoNombre: string) => {
    const state = get();
    const original = state.inventarios.find(i => i.id === id);
    if (!original) return;
    const newId = uid();
    const newInv: Inventario = {
      ...original, id: newId, nombre: nuevoNombre, es_activo: false, clonado_de: id, created_at: new Date().toISOString(),
    };
    
    const newMaterias = state.materiasPrimas
      .filter(mp => mp.inventario_id === id)
      .map(mp => ({ ...mp, id: uid(), inventario_id: newId, created_at: new Date().toISOString() }));
      
    const newMaquinas = state.maquinas
      .filter(m => m.inventario_id === id)
      .map(m => ({ ...m, id: uid(), inventario_id: newId, created_at: new Date().toISOString() }));

    // Insert en bloque
    const { error: errInv } = await supabase.from('inventarios').insert(newInv);
    if (errInv) return console.error(errInv);
    
    if (newMaterias.length > 0) {
      await supabase.from('materias_primas').insert(newMaterias);
    }
    if (newMaquinas.length > 0) {
      await supabase.from('maquinas').insert(newMaquinas);
    }

    set(state => ({
      inventarios: [...state.inventarios, newInv],
      materiasPrimas: [...state.materiasPrimas, ...newMaterias],
      maquinas: [...state.maquinas, ...newMaquinas],
    }));
  },

  actualizarMateriaPrima: async (id, updates) => {
    const { error } = await supabase.from('materias_primas').update(updates).eq('id', id);
    if (!error) {
      set(state => ({
        materiasPrimas: state.materiasPrimas.map(mp =>
          mp.id === id ? { ...mp, ...updates } : mp
        ),
      }));
    }
  },

  actualizarMaquina: async (id, updates) => {
    const { error } = await supabase.from('maquinas').update(updates).eq('id', id);
    if (!error) {
      set(state => ({
        maquinas: state.maquinas.map(m =>
          m.id === id ? { ...m, ...updates } : m
        ),
      }));
    }
  },

  descontarMateria: async (inventarioId, nombreMp, cantidad) => {
    const mp = get().materiasPrimas.find(m => m.inventario_id === inventarioId && m.nombre === nombreMp);
    if (!mp) return;
    const newQty = Math.max(0, mp.cantidad_disponible - cantidad);
    
    const { error } = await supabase.from('materias_primas').update({ cantidad_disponible: newQty }).eq('id', mp.id);
    if (!error) {
      set(state => ({
        materiasPrimas: state.materiasPrimas.map(m =>
          m.id === mp.id ? { ...m, cantidad_disponible: newQty } : m
        ),
      }));
    }
  },

  agregarMateriaPrima: async (mp) => {
    const newMp = { ...mp, id: uid(), created_at: new Date().toISOString() };
    const { error } = await supabase.from('materias_primas').insert(newMp);
    if (!error) {
      set(state => ({ materiasPrimas: [...state.materiasPrimas, newMp] }));
    }
  },

  agregarMaquina: async (m) => {
    const newMq = { ...m, id: uid(), created_at: new Date().toISOString() };
    const { error } = await supabase.from('maquinas').insert(newMq);
    if (!error) {
      set(state => ({ maquinas: [...state.maquinas, newMq] }));
    }
  },
}));

// ============================================
// PRODUCTOS STORE
// ============================================
interface ProductosState {
  productos: Producto[];
  recetas: Receta[];
  getRecetasByProducto: (productoId: string) => Receta[];
  getProductosByLinea: (linea: string) => Producto[];
  toggleProducto: (id: string) => void;
}

export const useProductosStore = create<ProductosState>((set, get) => ({
  productos: seedProductos,
  recetas: seedRecetas,

  getRecetasByProducto: (productoId: string) =>
    get().recetas.filter(r => r.producto_id === productoId),

  getProductosByLinea: (linea: string) =>
    get().productos.filter(p => p.linea === linea && p.activo),

  toggleProducto: (id: string) => {
    set(state => ({
      productos: state.productos.map(p =>
        p.id === id ? { ...p, activo: !p.activo } : p
      ),
    }));
  },
}));

// ============================================
// PRODUCCION STORE
// ============================================
interface ProduccionState {
  lotes: LoteProduccion[];
  loteProductos: LoteProducto[];
  loteMaquinas: LoteMaquinaUsada[];
  loteTrabajadores: LoteTrabajador[];
  registrarLote: (
    lote: Omit<LoteProduccion, 'id' | 'created_at'>,
    items: Omit<LoteProducto, 'id' | 'lote_id'>[],
    maquinas: Omit<LoteMaquinaUsada, 'id' | 'lote_id'>[],
    trabajadores: Omit<LoteTrabajador, 'id' | 'lote_id'>[]
  ) => string;
  getLotesByInventario: (invId: string) => LoteProduccion[];
}

export const useProduccionStore = create<ProduccionState>((set, get) => ({
  lotes: [],
  loteProductos: [],
  loteMaquinas: [],
  loteTrabajadores: [],

  registrarLote: (lote, items, maquinas, trabajadores) => {
    const loteId = uid();
    const newLote: LoteProduccion = {
      ...lote, id: loteId, created_at: new Date().toISOString(),
    };
    const newItems = items.map(i => ({ ...i, id: uid(), lote_id: loteId }));
    const newMaq = maquinas.map(m => ({ ...m, id: uid(), lote_id: loteId }));
    const newTrab = trabajadores.map(t => ({ ...t, id: uid(), lote_id: loteId }));

    set(state => ({
      lotes: [...state.lotes, newLote],
      loteProductos: [...state.loteProductos, ...newItems],
      loteMaquinas: [...state.loteMaquinas, ...newMaq],
      loteTrabajadores: [...state.loteTrabajadores, ...newTrab],
    }));

    return loteId;
  },

  getLotesByInventario: (invId: string) =>
    get().lotes.filter(l => l.inventario_id === invId),
}));

// ============================================
// TRABAJADORES STORE
// ============================================
interface TrabajadoresState {
  trabajadores: Trabajador[];
  agregarTrabajador: (t: Omit<Trabajador, 'id'>) => void;
  actualizarTrabajador: (id: string, updates: Partial<Trabajador>) => void;
  toggleTrabajador: (id: string, activo: boolean) => Promise<void>;
  eliminarTrabajador: (id: string) => void;
  getTrabajadoresProduccion: () => Trabajador[];
  getCostoHora: (trabajadorId: string) => number;
}

export const useTrabajadoresStore = create<TrabajadoresState>((set, get) => ({
  trabajadores: defaultTrabajadores,

  agregarTrabajador: (t) => {
    set(state => ({ trabajadores: [...state.trabajadores, { ...t, id: uid() }] }));
  },

  actualizarTrabajador: (id, updates) => {
    set(state => ({
      trabajadores: state.trabajadores.map(t =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },

  eliminarTrabajador: (id) => {
    set(state => ({
      trabajadores: state.trabajadores.filter(t => t.id !== id),
    }));
  },

  toggleTrabajador: async (id: string, activo: boolean) => {
    const { error } = await supabase.from('trabajadores').update({ activo }).eq('id', id);
    if (!error) {
      set(state => ({
        trabajadores: state.trabajadores.map(t =>
          t.id === id ? { ...t, activo } : t
        ),
      }));
    }
  },

  getTrabajadoresProduccion: () =>
    get().trabajadores.filter(t => t.area === 'produccion' && t.activo),

  getCostoHora: (trabajadorId: string) => {
    const t = get().trabajadores.find(w => w.id === trabajadorId);
    if (!t) return 0;
    return t.salario_mensual / (22 * t.horas_jornada_diaria); // 22 working days/month
  },
}));

// ============================================
// UI STORE (sidebar, theme, etc.)
// ============================================
interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module }),
}));
