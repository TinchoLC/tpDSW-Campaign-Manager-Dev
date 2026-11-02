import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useConfirmar } from '../hooks/useConfirmar';
import { mapaService } from '../services/mapa.service';
import { resolveAssetUrl } from '../services/api';
import { mensajeError } from '../utils/form';
import { Cargando } from './Cargando';
import { ErrorAlert } from './ErrorAlert';

interface Props {
  campanaId: number;
  esMaster: boolean;
  escribible: boolean;
}

export function MapasPanel({ campanaId, esMaster, escribible }: Props) {
  const { data: mapas, error, loading: cargando, recargar } = useApi(`mapas-${campanaId}`, () =>
    mapaService.deCampana(campanaId)
  );
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const { confirmar, dialogo } = useConfirmar();

  const eliminarMapa = async (id: number, nombre: string) => {
    if (!(await confirmar({
      titulo: 'Eliminar mapa',
      mensaje: `¿Eliminar el mapa "${nombre}"? Se quitan también las fichas que estén en él.`,
      textoConfirmar: 'Eliminar',
    }))) return;

    setErrorAccion(null);
    try {
      await mapaService.eliminar(id);
      recargar();
    } catch (err) {
      setErrorAccion(mensajeError(err));
    }
  };

  return (
    <section className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">Mapas</h4>
        {esMaster && escribible && (
          <Link to={`/campanas/${campanaId}/mapas/nuevo`} className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1" />
            Nuevo mapa
          </Link>
        )}
      </div>

      {cargando && <Cargando />}
      {error && <ErrorAlert mensaje={error.message} />}
      {errorAccion && <ErrorAlert mensaje={errorAccion} />}

      {mapas && mapas.length === 0 && (
        <p className="text-body-secondary">No hay mapas para mostrar.</p>
      )}

      {mapas && mapas.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Mapa</th>
                <th>Dimensiones</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mapas.map((mapa) => {
                const enJuego = mapa.estado === 'en_juego';
                const imagen = resolveAssetUrl(mapa.imagenUrl);

                return (
                  <tr key={mapa.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {imagen ? (
                          <img
                            src={imagen}
                            alt={mapa.nombre}
                            className="rounded object-fit-cover flex-shrink-0"
                            style={{ width: 44, height: 44 }}
                          />
                        ) : (
                          <div
                            className="rounded bg-secondary-subtle text-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 44, height: 44 }}
                          >
                            <i className="bi bi-map" />
                          </div>
                        )}
                        <span className="fw-medium">{mapa.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <small className="text-body-secondary">
                        {mapa.columnas} × {mapa.filas} celdas
                      </small>
                    </td>
                    <td className="text-body-secondary small">
                      {mapa.descripcion ? (
                        <span>{mapa.descripcion}</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${enJuego ? 'bg-success' : 'bg-secondary'}`}>
                        {enJuego ? 'En juego' : 'Preparado'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end align-items-center">
                        {esMaster && escribible && (
                          <>
                            <Link
                              to={`/campanas/${campanaId}/mapas/${mapa.id}/editar`}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => eliminarMapa(mapa.id, mapa.nombre)}
                              className="btn btn-outline-danger btn-sm"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {dialogo}
    </section>
  );
}
