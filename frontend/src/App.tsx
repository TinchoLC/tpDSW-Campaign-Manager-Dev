import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LayoutPrivado } from './components/LayoutPrivado';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CampanaDetalle } from './pages/CampanaDetalle';
import { Campanas } from './pages/Campanas';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Sesion } from './pages/Sesion';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />

      {/* Rutas que requieren sesión iniciada */}
      <Route element={<LayoutPrivado />}>
        <Route path="/" element={<Navigate to="/campanas" replace />} />
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
