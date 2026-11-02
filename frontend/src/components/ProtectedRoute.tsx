import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RutaProps {
  // Se puede envolver una pantalla (<ProtectedRoute><X /></ProtectedRoute>) o usar como
  // ruta padre (<Route element={<ProtectedRoute />}>...</Route>)
  children?: ReactNode;
}

// Deja pasar solo a quien tiene sesión iniciada; al resto lo manda al home
export function ProtectedRoute({ children }: RutaProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children ?? <Outlet />;
}