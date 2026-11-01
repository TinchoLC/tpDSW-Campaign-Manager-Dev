import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { campanaService, type Campana } from '../services/campana.service';
import { personajeService, type EstadoAgresion, type Personaje } from '../services/personaje.service';
import { mensajeError } from '../utils/form';
import { Cargando } from './Cargando';
import { ErrorAlert } from './ErrorAlert';
import { AgresionBadge } from './Badges';

type FiltroAgresion = EstadoAgresion | 'todos';

const FILTROS: { valor: FiltroAgresion; etiqueta: string }[] = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'hostil', etiqueta: 'Hostil' },
  { valor: 'neutral', etiqueta: 'Neutral' },
  { valor: 'amistoso', etiqueta: 'Amistoso' },
];

interface Props {
  campana: Campana;
  escribible: boolean; // false si la campaña está finalizada o eliminada
}

// NPCs de la campaña, filtrables por actitud. Solo lo muestra el master.
export function NpcsPanel({ campana, escribible }: Props) {
  const [filtro, setFiltro] = useState<FiltroAgresion>('todos');

  const { data: datos, error, loading: cargando, recargar } = useApi(`npcs-${campana.id}-${filtro}`, () =>
    campanaService.npcs(campana.id, filtro === 'todos' ? undefined : filtro)
  );
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const eliminar = async (npc: Personaje) => {
    if (!window.confirm(`¿Eliminar al NPC ${npc.nombre}?`)) return;
    setErrorAccion(null);
    try {
      await personajeService.eliminar(npc.id);
      recargar();
    } catch (err) {
      setErrorAccion(mensajeError(err));
    }
  };

  return (
    <section className="mb-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <h4 className="mb-0">NPCs</h4>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="btn-group" role="group" aria-label="Filtrar por actitud">
            {FILTROS.map((f) => (
              <button
                key={f.valor}
                type="button"
                className={`btn btn-sm ${filtro === f.valor ? 'btn-primary' : 'btn-outline-primary'}`}
                aria-pressed={filtro === f.valor}
                onClick={() => setFiltro(f.valor)}
              >
                {f.etiqueta}
              </button>
            ))}
          </div>

          {escribible && (
            <Link to={`/campanas/${campana.id}/npcs/nuevo`} className="btn btn-primary btn-sm">
              <i className="bi bi-plus-lg me-1"></i>Nuevo NPC
            </Link>
          )}
        </div>
      </div>

      {cargando && <Cargando />}
      {error && <ErrorAlert mensaje={error.message} />}
      {errorAccion && <ErrorAlert mensaje={errorAccion} />}

      {datos && datos.length === 0 && (
        <p className="text-body-secondary">
          {filtro === 'todos'
            ? 'Todavía no creaste NPCs en esta campaña.'
            : 'No hay NPCs con esa actitud.'}
        </p>
      )}

      {datos && datos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Actitud</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {datos.map((npc) => (
                <tr key={npc.id}>
                  <td><Link to={`/personajes/${npc.id}`}>{npc.nombre}</Link></td>
                  <td className="text-truncate" style={{ maxWidth: '320px' }}>
                    {npc.descripcion ?? '—'}
                  </td>
                  <td><AgresionBadge estado={npc.estadoAgresion} /></td>
                  <td className="text-end">
                    {escribible && (
                      <div className="d-flex gap-2 justify-content-end">
                        <Link to={`/personajes/${npc.id}/editar`} className="btn btn-outline-secondary btn-sm">
                          Editar
                        </Link>
                        <button onClick={() => eliminar(npc)} className="btn btn-outline-danger btn-sm">
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
