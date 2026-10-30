export type RolEnCampana = 'master' | 'jugador';

const ETIQUETAS: Record<RolEnCampana, string> = {
  master: 'Sos el master',
  jugador: 'Participás',
};

// Indica qué rol tiene el usuario en una campaña
export function RolBadge({ rol }: { rol: RolEnCampana }) {
  return <span className="badge text-bg-info">{ETIQUETAS[rol]}</span>;
}
