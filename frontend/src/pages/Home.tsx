import { Link, Navigate } from 'react-router-dom';
import { CircleIcon } from '../components/CircleIcon';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  const { isAuthenticated } = useAuth();

  // Si ya tiene sesión iniciada, va directo al listado de campañas
  if (isAuthenticated) {
    return <Navigate to="/campanas" replace />;
  }

  return (
    <main className="container d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center py-5">
      <div style={{ maxWidth: '640px' }}>
        <CircleIcon diametro={96} className="mb-4" />
        <h1 className="display-5 fw-bold mb-3">Campaign Manager</h1>
        <p className="lead text-secondary mb-4">
          Organizá tus campañas, personajes y mapas de rol.
        </p>

        <div className="d-flex justify-content-center gap-3 mb-5">
          <Link to="/register" className="btn btn-primary btn-lg px-4 fw-semibold shadow-sm">
            Crear cuenta
          </Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg px-4 fw-semibold">
            Iniciar sesión
          </Link>
        </div>

        <div className="row g-3 text-start">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <i className="bi bi-people text-primary fs-3 mb-2" />
              <h2 className="h6 fw-bold mb-1">Personajes</h2>
              <p className="small text-secondary mb-0">
                Prepará tus atributos, rasgos y equipamiento.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <i className="bi bi-shield-shaded text-primary fs-3 mb-2" />
              <h2 className="h6 fw-bold mb-1">Campañas</h2>
              <p className="small text-secondary mb-0">
                Coordiná tus partidas y armá tu grupo de aventuras.
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <i className="bi bi-grid-3x3 text-primary fs-3 mb-2" />
              <h2 className="h6 fw-bold mb-1">Mapas y Fichas</h2>
              <p className="small text-secondary mb-0">
                Posicioná y mové fichas sobre la grilla en vivo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
