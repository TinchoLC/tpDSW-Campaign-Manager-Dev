import { Link } from 'react-router-dom';
import type { Campana } from '../services/campana.service';
import { EstadoBadge } from './EstadoBadge';
import { ImagenPortada } from './ImagenPortada';
import { RolBadge } from './RolBadge';

interface TarjetaCampanaProps {
  campana: Campana;
  esMaster?: boolean; // el listado de la API no dice en qué campañas se participa, solo se sabe si se es master
}

// Resumen de una campaña para el listado: imagen, nombre, master y estado
export function TarjetaCampana({ campana, esMaster = false }: TarjetaCampanaProps) {
  return (
    <div className="col">
      <Link to={`/campanas/${campana.id}`} className="card h-100 text-decoration-none">
        <ImagenPortada url={campana.imagenUrl} alt={campana.nombre} alto={160} />

        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <EstadoBadge estado={campana.estado} />
            {esMaster && <RolBadge rol="master" />}
          </div>
          <h5 className="card-title mb-1">{campana.nombre}</h5>
          <p className="card-text text-body-secondary mb-0">
            <i className="bi bi-person-fill me-1" />
            Master: {campana.master.nombre}
          </p>
        </div>
      </Link>
    </div>
  );
}
