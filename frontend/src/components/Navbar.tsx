import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav className="navbar border-bottom">
      <div className="container">
        <Link to="/campanas" className="navbar-brand">
          <i className="bi bi-dice-5 me-2" />
          Campaign Manager
        </Link>

        <div className="d-flex align-items-center gap-3">
          <span className="text-body-secondary">
            <i className="bi bi-person-circle me-1" />
            {usuario?.nombre}
          </span>
          <button onClick={logout} className="btn btn-outline-danger btn-sm">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
