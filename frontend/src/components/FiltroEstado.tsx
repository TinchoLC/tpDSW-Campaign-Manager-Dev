import { ESTADOS_CAMPANA, ETIQUETAS_ESTADO, type FiltroEstadoCampana } from '../../../frontend-campanas/frontend/src/services/campana.service';

const OPCIONES: { valor: FiltroEstadoCampana; etiqueta: string }[] = [
  { valor: 'todas', etiqueta: 'Todas' },
  ...ESTADOS_CAMPANA.map((estado) => ({ valor: estado, etiqueta: ETIQUETAS_ESTADO[estado] })),
];

interface FiltroEstadoProps {
  valor: FiltroEstadoCampana;
  onChange: (valor: FiltroEstadoCampana) => void;
}

// Botones para filtrar campañas por estado (o ver todas)
export function FiltroEstado({ valor, onChange }: FiltroEstadoProps) {
  return (
    <div className="btn-group" role="group" aria-label="Filtrar por estado">
      {OPCIONES.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          className={`btn btn-sm ${valor === opcion.valor ? 'btn-primary' : 'btn-outline-primary'}`}
          aria-pressed={valor === opcion.valor}
          onClick={() => onChange(opcion.valor)}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}
