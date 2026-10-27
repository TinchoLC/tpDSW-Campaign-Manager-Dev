import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function HomeTemporal() {
  const { usuario, logout } = useAuth();

  return (
    <main className="container mt-5 text-center">
      <h2>¡Hola, {usuario?.nombre}!</h2>
      <p>Sesión iniciada correctamente (Rol: {usuario?.tipo})</p>
      <button onClick={logout} className="btn btn-outline-danger mt-2">
        Cerrar sesión
      </button>
    </main>
  );
}

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
      <Route
        path="/"
        element={isAuthenticated ? <HomeTemporal /> : <Navigate to="/login" />}
      />
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