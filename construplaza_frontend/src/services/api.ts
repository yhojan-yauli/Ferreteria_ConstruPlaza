const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/** Rutas API (deben coincidir con @RequestMapping en backend):
 * - /auth/login
 * - /api/productos, /api/productos/{id}
 * - /api/categorias
 * - /construplaza/vendedor/clientes, /construplaza/vendedor/venta, /construplaza/vendedor/mis-ventas
 * - /admin/usuarios/crear, /admin/usuarios/lista, /admin/usuarios/historial
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: 'ADMIN' | 'VENDEDOR' | 'ALMACENERO' | 'CLIENTE';
}

export interface CreateUserRequest {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role: 'VENDEDOR' | 'ALMACENERO';
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  tipoDocumento: 'DNI' | 'RUC';
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoCliente: 'PERSONA' | 'EMPRESA';
  fechaRegistro: string;
}

export interface CreateClienteRequest {
  nombre: string;
  apellido: string;
  tipoDocumento: 'DNI' | 'RUC';
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoCliente: 'PERSONA' | 'EMPRESA';
}

export interface Producto {
  id: number;
  nombre: string;
  sku: string;
  marca: string;
  categoria: string | null;
  precio: number;
  stock: number;
  imagen: string | null;
}

/** Respuesta del backend GET /construplaza/vendedor/clientes (ClienteListDTO) */
export interface ClienteListResponse {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string | null;
  razonSocial: string | null;
  direccion: string | null;
}

export interface HistorialAccionResponse {
  id: number;
  usuario: User;
  tipoAccion: string;
  tipoEntidad: string;
  descripcion: string;
  detalle: string;
  fechaHora: string;
}

export interface VentaResumen {
  idVenta: number;
  fechaEmision: string;
  tipoComprobante: string;
  serie: string;
  numero: string;
  totalGravado: number;
  igv: number;
  total: number;
  metodoPago: string;
  vendedor: User;
}

/** Payload para POST /construplaza/vendedor/venta (VentaRequest) */
export interface VentaRequestPayload {
  tipoComprobante: 'BOLETA' | 'FACTURA';
  metodoPago: 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'PLIN';
  montoPagado: number;
  cliente?: {
    anonimo: boolean;
    tipoDocumento: string;
    numeroDocumento: string;
    nombres: string | null;
    razonSocial: string | null;
    direccion: string | null;
  };
  detalles: { idProducto: number; cantidad: number }[];
}

// Función helper para obtener el token del localStorage
const getToken = (): string | null => {
  return localStorage.getItem('construplaza_token');
};

// Función helper para hacer peticiones autenticadas
const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expirado o inválido
    localStorage.removeItem('construplaza_token');
    localStorage.removeItem('construplaza_user');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }

  return response;
};

// API de Autenticación
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = 'Credenciales inválidas';
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (e) {
          // Si no se puede leer el error, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error: any) {
      // Si es un error de red (CORS, conexión, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Error de conexión:', error);
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080');
      }
      // Re-lanzar el error para que se propague
      throw error;
    }
  },
};

// API de Usuarios (solo admin)
export const userAPI = {
  createUser: async (userData: CreateUserRequest): Promise<string> => {
    const response = await authenticatedFetch('/admin/usuarios/crear', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al crear usuario');
    }

    return response.text();
  },

  listUsers: async (): Promise<User[]> => {
    const response = await authenticatedFetch('/admin/usuarios/lista');

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Error al obtener usuarios');
    }

    const data = await response.json();
    return ensureArray<User>(data);
  },
};

/** Asegura que la respuesta sea un array (evita crash si el backend devuelve texto) */
const ensureArray = <T>(data: unknown): T[] => (Array.isArray(data) ? data : []);

/** Categoría del backend (GET /api/categorias) */
export interface CategoriaBackend {
  idCategoria: number;
  nombre: string;
  descripcion?: string;
}

// API de Categorías
export const categoriaAPI = {
  listar: async (): Promise<CategoriaBackend[]> => {
    try {
      const response = await authenticatedFetch('/api/categorias');
      if (!response.ok) throw new Error('Error al obtener categorías');
      const data = await response.json();
      return ensureArray<CategoriaBackend>(data);
    } catch (error) {
      console.error('Error en categoriaAPI:', error);
      return [];
    }
  },
};

/** Payload para crear/actualizar producto (campos que acepta el backend) */
export interface ProductoPayload {
  nombre: string;
  sku: string;
  marca?: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: 'UND' | 'KG' | 'M' | 'LT';
  categoria?: { idCategoria: number } | null;
  imagenUrl?: string | null;
  estado?: boolean;
}

// API de Productos
export const productoAPI = {
  listarProductos: async (): Promise<Producto[]> => {
    try {
      const response = await authenticatedFetch('/api/productos');
      if (!response.ok) throw new Error('Error al obtener productos');
      const data = await response.json();
      return ensureArray<Producto>(data);
    } catch (error) {
      console.error('Error en productoAPI:', error);
      return [];
    }
  },

  crear: async (body: ProductoPayload): Promise<void> => {
    const response = await authenticatedFetch('/api/productos', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al crear producto');
    }
  },

  actualizar: async (id: number, body: ProductoPayload): Promise<void> => {
    const response = await authenticatedFetch(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al actualizar producto');
    }
  },

  eliminar: async (id: number): Promise<void> => {
    const response = await authenticatedFetch(`/api/productos/${id}`, { method: 'DELETE' });
    if (response.status === 409) {
      const data = await response.json().catch(() => ({}));
      const msg = (data as { mensaje?: string })?.mensaje ?? 'No se puede eliminar porque tiene historial asociado.';
      throw new Error(msg);
    }
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al eliminar producto');
    }
  },
};

// API de Clientes
export const clienteAPI = {
  listar: async (): Promise<ClienteListResponse[]> => {
    try {
      const response = await authenticatedFetch('/construplaza/vendedor/clientes');
      if (!response.ok) throw new Error('Error al obtener clientes');
      const data = await response.json();
      return ensureArray<ClienteListResponse>(data);
    } catch (error) {
      console.error('Error en clienteAPI:', error);
      return [];
    }
  },
};

// API de Historial de Acciones (solo admin)
export const historialAPI = {
  listar: async (): Promise<HistorialAccionResponse[]> => {
    try {
      const response = await authenticatedFetch('/admin/usuarios/historial');
      if (!response.ok) throw new Error('Error al obtener historial');
      const data = await response.json();
      return ensureArray<HistorialAccionResponse>(data);
    } catch (error) {
      console.error('Error en historialAPI:', error);
      return [];
    }
  },
};

// API de Ventas del vendedor actual
export const ventasAPI = {
  misVentas: async (): Promise<VentaResumen[]> => {
    try {
      const response = await authenticatedFetch('/construplaza/vendedor/mis-ventas');
      if (!response.ok) throw new Error('Error al obtener ventas');
      const data = await response.json();
      return ensureArray<VentaResumen>(data);
    } catch (error) {
      console.error('Error en ventasAPI:', error);
      return [];
    }
  },

  registrar: async (body: VentaRequestPayload): Promise<unknown> => {
    const response = await authenticatedFetch('/construplaza/vendedor/venta', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al registrar la venta');
    }
    return response.json();
  },
};
