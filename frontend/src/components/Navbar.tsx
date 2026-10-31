import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircleIcon } from './CircleIcon';

export function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand border-bottom bg-white shadow-sm py-2">
      <div className="container">
        <Link to="/campanas" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark text-decoration-none">
          <CircleIcon diametro={32} />
          <span>Campaign Manager</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <span className="text-secondary small d-flex align-items-center gap-1">
            <i className="bi bi-person-circle fs-6" />
            <span className="fw-semibold text-dark">{usuario?.nombre}</span>
          </span>
          <button onClick={logout} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1">
            <i className="bi bi-box-arrow-right" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
