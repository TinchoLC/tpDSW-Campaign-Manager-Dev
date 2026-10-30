import type { Participante } from '../../../frontend-campanas/frontend/src/services/campana.service';
import { Avatar } from './Avatar';

// Personajes que participan en una campaña, con su jugador y su vida
export function ListaParticipantes({ participantes }: { participantes: Participante[] }) {
  if (participantes.length === 0) {
    return <p className="text-body-secondary">Todavía no se unió ningún personaje.</p>;
  }

  return (
    <ul className="list-group">
      {participantes.map((p) => (
        <li key={p.id} className="list-group-item d-flex align-items-center gap-3">
          <Avatar url={p.personaje.imagenUrl} tamanio={40} />

          <div className="flex-grow-1">
            <div className="fw-semibold">{p.nombre}</div>
            <small className="text-body-secondary">
              {p.clase ? `${p.clase} · ` : ''}nivel {p.nivel} · jugador: {p.personaje.usuario.nombre}
            </small>
          </div>

          <span className="text-body-secondary">
            <i className="bi bi-heart-fill text-danger me-1" />
            {p.vidaActual}/{p.vidaMax}
          </span>
        </li>
      ))}
    </ul>
  );
}
