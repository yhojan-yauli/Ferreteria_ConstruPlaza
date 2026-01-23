import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usuariosMock, Usuario } from '@/data/mockData';

interface AuthContextType {
  user: Usuario | null;
  login: (usuario: string, password: string) => boolean;
  register: (nombre: string, dni: string, usuario: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const stored = localStorage.getItem('construplaza_usuarios');
    return stored ? JSON.parse(stored) : usuariosMock;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('construplaza_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('construplaza_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const login = (usuario: string, password: string): boolean => {
    const foundUser = usuarios.find(
      (u) => u.usuario === usuario && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('construplaza_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (nombre: string, dni: string, usuario: string, password: string): boolean => {
    const exists = usuarios.some((u) => u.usuario === usuario || u.dni === dni);
    if (exists) return false;

    const newUser: Usuario = {
      id: usuarios.length + 1,
      usuario,
      password,
      nombre,
      dni,
      rol: 'VENDEDOR' // Siempre asigna rol VENDEDOR por seguridad
    };

    setUsuarios([...usuarios, newUser]);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('construplaza_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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
