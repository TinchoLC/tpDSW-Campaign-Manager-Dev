import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LayoutPrivado } from './components/LayoutPrivado';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CampanaDetalle } from './pages/CampanaDetalle';
import { CampanaForm } from './pages/CampanaForm';
import { Campanas } from './pages/Campanas';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { MapEditor } from './pages/MapEditor';
import { MisPersonajes } from './pages/MisPersonajes';
import { Perfil } from './pages/Perfil';
import { PersonajeDetalle } from './pages/PersonajeDetalle';
import { PersonajeForm } from './pages/PersonajeForm';
import { Rasgos } from './pages/Rasgos';
import { Register } from './pages/Register';
import { Sesion } from './pages/Sesion';
import { Layout } from './components/Layout';
import { NotFound } from './pages/NotFound';

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

      {/* Rutas que requieren sesión iniciada (dentro de LayoutPrivado con Header) */}
      <Route element={<LayoutPrivado />}>
        <Route path="/campanas" element={<Campanas />} />
        <Route path="/campanas/nueva" element={<CampanaForm />} />
        <Route path="/campanas/:id" element={<CampanaDetalle />} />
        <Route path="/campanas/:id/editar" element={<CampanaForm />} />
        <Route path="/campanas/:id/sesion" element={<Sesion />} />
        <Route path="/campanas/:id/mapas/nuevo" element={<MapEditor />} />
        <Route path="/campanas/:campanaId/npcs/nuevo" element={<PersonajeForm />} />

        <Route path="/personajes" element={<MisPersonajes />} />
        <Route path="/personajes/nuevo" element={<PersonajeForm />} />
        <Route path="/personajes/:id" element={<PersonajeDetalle />} />
        <Route path="/personajes/:id/editar" element={<PersonajeForm />} />

        <Route path="/rasgos" element={<Rasgos />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<NotFound />} />
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
