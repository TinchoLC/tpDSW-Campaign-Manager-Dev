import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutPrivado } from './components/LayoutPrivado';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Admin } from './pages/Admin';
import { CampanaDetalle } from './pages/CampanaDetalle';
import { CampanaForm } from './pages/CampanaForm';
import { Campanas } from './pages/Campanas';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { MapEditor } from './pages/MapEditor';
import { MisPersonajes } from './pages/MisPersonajes';
import { NoEncontrado } from './pages/NoEncontrado';
import { Perfil } from './pages/Perfil';
import { PersonajeDetalle } from './pages/PersonajeDetalle';
import { PersonajeForm } from './pages/PersonajeForm';
import { Rasgos } from './pages/Rasgos';
import { Register } from './pages/Register';
import { Sesion } from './pages/Sesion';

// Mapa completo de rutas de la aplicación. Cada pantalla vive en su archivo de pages/: para
// implementar una pantalla nueva se edita esa página, no este archivo.
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* ── Públicas ── */}
      {/* Portada (sin sesión muestra Home, con sesión redirige a /campanas) */}
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

      {/* ── Requieren sesión (ProtectedRoute) y llevan el header (LayoutPrivado) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutPrivado />}>
          {/* Campañas y lo que hay dentro de una campaña */}
          <Route path="/campanas" element={<Campanas />} />
          <Route path="/campanas/nueva" element={<CampanaForm />} />
          <Route path="/campanas/:id" element={<CampanaDetalle />} />
          <Route path="/campanas/:id/editar" element={<CampanaForm />} />
          <Route path="/campanas/:id/sesion" element={<Sesion />} />
          <Route path="/campanas/:id/mapas/nuevo" element={<MapEditor />} />
          <Route path="/campanas/:campanaId/npcs/nuevo" element={<PersonajeForm />} />

          {/* Personajes */}
          <Route path="/personajes" element={<MisPersonajes />} />
          <Route path="/personajes/nuevo" element={<PersonajeForm />} />
          <Route path="/personajes/:id" element={<PersonajeDetalle />} />
          <Route path="/personajes/:id/editar" element={<PersonajeForm />} />

          {/* Rasgos y perfil */}
          <Route path="/rasgos" element={<Rasgos />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* ── Solo administradores (AdminRoute) ── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      {/* Cualquier otra ruta */}
      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
