const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

    return response.json();
  },
};
