import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LayoutPrivado } from './components/LayoutPrivado';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CampanaDetalle } from './pages/CampanaDetalle';
import { Campanas } from './pages/Campanas';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Sesion } from './pages/Sesion';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Portada pública (sin sesión muestra Home, con sesión redirige a /campanas) */}
      <Route path="/" element={<Home />} />

      {/* Autenticación (si ya está logueado va directo a /campanas) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/campanas" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/campanas" replace /> : <Register />}
      />

      {/* Rutas que requieren sesión iniciada (dentro de LayoutPrivado con Navbar) */}
      <Route element={<LayoutPrivado />}>
        <Route path="/campanas" element={<Campanas />} />
        <Route path="/campanas/:id" element={<CampanaDetalle />} />
        <Route path="/campanas/:id/sesion" element={<Sesion />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
