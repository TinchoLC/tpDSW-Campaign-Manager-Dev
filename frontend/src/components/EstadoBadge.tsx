import { ETIQUETAS_ESTADO, type EstadoCampana } from '../services/campana.service';

const CLASES: Record<EstadoCampana, string> = {
  planificada: 'text-bg-secondary',
  activa: 'text-bg-success',
  pausada: 'text-bg-warning',
  finalizada: 'text-bg-dark border',
};

export function EstadoBadge({ estado }: { estado: EstadoCampana }) {
  return <span className={`badge ${CLASES[estado]}`}>{ETIQUETAS_ESTADO[estado]}</span>;
}
