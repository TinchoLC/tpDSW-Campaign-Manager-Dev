import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleIcon } from '../components/CircleIcon';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nombre = String(formData.get('nombre') || '').trim();
    const contrasena = String(formData.get('contrasena') || '');
    const confirmarContrasena = String(formData.get('confirmarContrasena') || '');

    const confirmarInput = form.elements.namedItem('confirmarContrasena') as HTMLInputElement | null;

    if (contrasena !== confirmarContrasena) {
      if (confirmarInput) {
        confirmarInput.setCustomValidity('Las contraseñas no coinciden');
        confirmarInput.reportValidity();
      }
      return;
    }

    confirmarInput?.setCustomValidity('');

    try {
      setCargando(true);
      await register({ nombre, contrasena });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: '420px' }}>
      <div className="card shadow-sm border-0 p-4">
        <div className="text-center mb-3">
          <CircleIcon diametro={64} className="mb-2" />
          <h2 className="h4 fw-bold mb-1">Crear Cuenta</h2>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Nombre de usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary">
                <i className="bi bi-person" />
              </span>
              <input
                name="nombre"
                type="text"
                className="form-control"
                placeholder="Ej: Aragorn"
                minLength={3}
                required
                disabled={cargando}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary">
                <i className="bi bi-lock" />
              </span>
              <input
                name="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                className="form-control"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                disabled={cargando}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrarContrasena((prev) => !prev)}
              >
                <i className={`bi ${mostrarContrasena ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Repetir contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary">
                <i className="bi bi-shield-lock" />
              </span>
              <input
                name="confirmarContrasena"
                type={mostrarConfirmar ? 'text' : 'password'}
                className="form-control"
                placeholder="Repetí tu contraseña"
                minLength={6}
                required
                disabled={cargando}
                onChange={(e) => e.currentTarget.setCustomValidity('')}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrarConfirmar((prev) => !prev)}
              >
                <i className={`bi ${mostrarConfirmar ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={cargando}>
            {cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>

          <p className="text-center text-secondary small mt-3 mb-0">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
