import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { campanaService, type Campana } from '../services/campana.service';
import { personajeService, type Personaje } from '../services/personaje.service';
import { mensajeError } from '../utils/form';
import { Cargando } from './Cargando';
import { ErrorAlert } from './ErrorAlert';
import { AgresionBadge } from './Badges';
import { Avatar } from './Avatar';

interface Props {
  campana: Campana;
  escribible: boolean; // false si la campaña está finalizada o eliminada
}

// NPCs de la campaña. Solo lo muestra el master.
export function NpcsPanel({ campana, escribible }: Props) {
  const { data: datos, error, loading: cargando, recargar } = useApi(`npcs-${campana.id}`, () =>
    campanaService.npcs(campana.id)
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
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">NPCs</h4>
        {escribible && (
          <Link to={`/campanas/${campana.id}/npcs/nuevo`} className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1"></i>Nuevo NPC
          </Link>
        )}
      </div>

      {cargando && <Cargando />}
      {error && <ErrorAlert mensaje={error.message} />}
      {errorAccion && <ErrorAlert mensaje={errorAccion} />}

      {datos && datos.length === 0 && (
        <p className="text-body-secondary">Todavía no creaste NPCs en esta campaña.</p>
      )}

      {datos && datos.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Actitud</th>
                <th>Vida máx.</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {datos.map((npc) => (
                <tr key={npc.id}>
                  <td><div className="d-flex align-items-center gap-2"><Avatar url={npc.imagenUrl} nombre={npc.nombre} tamanio={32} /><Link to={`/personajes/${npc.id}`}>{npc.nombre}</Link></div></td>
                  <td>{npc.especie ?? '—'}</td>
                  <td><AgresionBadge estado={npc.estadoAgresion} /></td>
                  <td>{npc.vidaMax ?? '—'}</td>
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
