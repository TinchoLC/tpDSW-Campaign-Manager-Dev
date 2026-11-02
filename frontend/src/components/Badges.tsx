// El estado de la campaña se muestra con EstadoBadge; acá solo los de participante y NPC
import type { EstadoPersonajeCampana } from '../services/campana.service';

const COLOR_PARTICIPANTE: Record<EstadoPersonajeCampana, string> = {
  vivo: 'bg-success',
  inconsciente: 'bg-warning text-dark',
  muerto: 'bg-danger',
};

const COLOR_AGRESION: Record<string, string> = {
  hostil: 'bg-danger',
  neutral: 'bg-secondary',
  amistoso: 'bg-success',
};

export function EstadoParticipanteBadge({ estado }: { estado: EstadoPersonajeCampana }) {
  return <span className={`badge ${COLOR_PARTICIPANTE[estado]}`}>{estado}</span>;
}

export function AgresionBadge({ estado }: { estado: string | null }) {
  const valor = estado ?? 'neutral';
  return <span className={`badge ${COLOR_AGRESION[valor] ?? 'bg-secondary'}`}>{valor}</span>;
}
