import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { resolveAssetUrl } from '../services/api';
import { CircleIcon } from './CircleIcon';

export function Header() {
  const { usuario, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!usuario) return null;

  const userAvatarUrl = resolveAssetUrl(usuario.imagenUrl);

  return (
    <header
      className="navbar navbar-expand-md bg-white border-bottom shadow-sm py-2"
      data-bs-theme="light"
    >
      <div className="container">
        {/* Logo */}
        <Link to="/campanas" className="navbar-brand d-flex align-items-center gap-2 text-dark fw-semibold">
          <CircleIcon diametro={32} />
          <span>Campaign Manager</span>
        </Link>

        {/* Botón hamburguesa estándar de Bootstrap */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Menú */}
        <div
          className={`collapse navbar-collapse ${open ? 'show' : ''}`}
          onClick={() => setOpen(false)}
        >
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink to="/campanas" className="nav-link">
                Campañas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/personajes" className="nav-link">
                Mis personajes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/rasgos" className="nav-link">
                Rasgos
              </NavLink>
            </li>
          </ul>

          {/* Usuario y Cerrar sesión */}
          <div className="d-flex align-items-center gap-3 ms-md-auto">
            <NavLink
              to="/perfil"
              className="nav-link d-flex align-items-center gap-2 p-0 text-dark"
            >
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt={usuario.nombre}
                  className="rounded-circle shadow-sm"
                  style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                />
              ) : (
                <i className="bi bi-person-circle fs-5 text-secondary" />
              )}
              <span className="fw-medium">{usuario.nombre}</span>
            </NavLink>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
