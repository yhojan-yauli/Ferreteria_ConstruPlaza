import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI } from '@/services/api';
import type { User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para decodificar el JWT y extraer información del usuario
const decodeJWT = (token: string): { username: string; role: string; exp: number } | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return {
      username: decoded.sub,
      role: decoded.role || 'VENDEDOR',
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

// Función para verificar si el token está expirado
const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded) return true;
  const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
  return Date.now() >= expirationTime;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar token y usuario del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('construplaza_token');
    const storedUser = localStorage.getItem('construplaza_user');

    if (storedToken && storedUser) {
      // Verificar si el token no ha expirado
      if (!isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Token expirado, limpiar
        localStorage.removeItem('construplaza_token');
        localStorage.removeItem('construplaza_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const response = await authAPI.login({ username, password });
    const jwtToken = response.token;

    // Decodificar el JWT para obtener información del usuario
    const decoded = decodeJWT(jwtToken);
    if (!decoded) {
      throw new Error('Error al procesar el token');
    }

    // Intentar obtener los datos completos del usuario si es admin
    let userData: User = {
      id: 0,
      username: decoded.username,
      firstname: '',
      lastname: '',
      role: decoded.role as User['role'],
    };

    // Si es admin, intentar obtener los datos completos de la lista de usuarios
    if (decoded.role === 'ADMIN') {
      try {
        const users = await userAPI.listUsers();
        const fullUserData = users.find((u) => u.username === decoded.username);
        if (fullUserData) {
          userData = fullUserData;
        }
      } catch (err) {
        // Si falla, usar solo los datos del token
        console.warn('No se pudieron obtener los datos completos del usuario:', err);
      }
    }

    // Guardar en localStorage
    localStorage.setItem('construplaza_token', jwtToken);
    localStorage.setItem('construplaza_user', JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('construplaza_token');
    localStorage.removeItem('construplaza_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
