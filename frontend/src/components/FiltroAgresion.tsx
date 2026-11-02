import type { EstadoAgresion } from '../services/personaje.service';

export type FiltroAgresionValor = EstadoAgresion | 'todos';

const OPCIONES: { valor: FiltroAgresionValor; etiqueta: string }[] = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'hostil', etiqueta: 'Hostil' },
  { valor: 'neutral', etiqueta: 'Neutral' },
  { valor: 'amistoso', etiqueta: 'Amistoso' },
];

interface FiltroAgresionProps {
  valor: FiltroAgresionValor;
  onChange: (valor: FiltroAgresionValor) => void;
}

// Botones para filtrar NPCs por actitud (o ver todos)
export function FiltroAgresion({ valor, onChange }: FiltroAgresionProps) {
  return (
    <div className="btn-group" role="group" aria-label="Filtrar por actitud">
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