import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const nombre = String(formData.get('nombre') || '').trim();
    const contrasena = String(formData.get('contrasena') || '');

    try {
      await register({ nombre, contrasena });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    }
  };

  return (
    <main className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Registrarse</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form action={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input name="nombre" type="text" className="form-control" minLength={3} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input name="contrasena" type="password" className="form-control" minLength={6} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Crear cuenta
        </button>

        <p className="text-center mt-3 mb-0">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </main>
  );
}