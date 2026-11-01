import type { Participante } from '../services/campana.service';
import { Avatar } from './Avatar';
import { EstadoParticipanteBadge } from './Badges';

interface ListaParticipantesProps {
  participantes: Participante[];
  // Si se pasan ambos, se muestra el botón Desvincular en los participantes que correspondan
  puedeDesvincular?: (participante: Participante) => boolean;
  onDesvincular?: (participante: Participante) => void;
}

// Personajes que participan en una campaña, con su jugador, su vida y su estado
export function ListaParticipantes({ participantes, puedeDesvincular, onDesvincular }: ListaParticipantesProps) {
  if (participantes.length === 0) {
    return <p className="text-body-secondary">Todavía no se unió ningún personaje.</p>;
  }

  return (
    <ul className="list-group">
      {participantes.map((p) => (
        <li key={p.id} className="list-group-item d-flex align-items-center gap-3">
          <Avatar url={p.personaje.imagenUrl} nombre={p.nombre} tamanio={40} />

          <div className="flex-grow-1">
            <div className="fw-semibold">{p.nombre}</div>
            <small className="text-body-secondary">
              {p.clase ? `${p.clase} · ` : ''}nivel {p.nivel} · jugador: {p.personaje.usuario.nombre}
            </small>
          </div>

          <EstadoParticipanteBadge estado={p.estado} />

          <span className="text-body-secondary">
            <i className="bi bi-heart-fill text-danger me-1" />
            {p.vidaActual}/{p.vidaMax}
          </span>

          {onDesvincular && puedeDesvincular?.(p) && (
            <button className="btn btn-outline-danger btn-sm" onClick={() => onDesvincular(p)}>
              Desvincular
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
