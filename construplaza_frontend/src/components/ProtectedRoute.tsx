import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'VENDEDOR';
}

// Función para verificar si el token JWT está expirado
const isTokenExpired = (token: string): boolean => {
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
    const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
    return Date.now() >= expirationTime;
  } catch (error) {
    return true; // Si hay error al decodificar, considerar expirado
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, token, logout } = useAuth();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    // Validar token al montar el componente
    if (token) {
      if (isTokenExpired(token)) {
        // Token expirado, cerrar sesión
        logout();
      }
    }
    setIsValidating(false);
  }, [token, logout]);

  if (isValidating) {
    return null; // O un componente de carga
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el token está expirado
  if (isTokenExpired(token)) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
    return <Navigate to="/ventas" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
