import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RutaProps {
  // Se puede envolver una pantalla (<ProtectedRoute><X /></ProtectedRoute>) o usar como
  // ruta padre (<Route element={<ProtectedRoute />}>...</Route>)
  children?: ReactNode;
}

// Deja pasar solo a quien tiene sesión iniciada; al resto lo manda al login
export function ProtectedRoute({ children }: RutaProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children ?? <Outlet />;
}

// Variante para pantallas de administración. Sin sesión va al login; con sesión pero sin rol
// de admin vuelve a la lista de campañas. Esto solo ordena la navegación: el backend es quien
// realmente exige el permiso en cada endpoint.
export function AdminRoute({ children }: RutaProps) {
  const { isAuthenticated, usuario } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (usuario?.tipo !== 'admin') return <Navigate to="/campanas" replace />;

  return children ?? <Outlet />;
}
