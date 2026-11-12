
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { ErrorPagina } from '../components/ErrorPagina';
import { PanelSesion } from '../components/PanelSesion';
import { TableroMapa } from '../components/TableroMapa';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { campanaService, type Campana, type Participante } from '../services/campana.service';
import { mapaService, type Mapa, type MapaConFichas } from '../services/mapa.service';
import { npcCampanaService, type NpcCampana } from '../services/npc-campana.service';
import { fichaService } from '../services/ficha.service';

const REFRESCO_FICHAS_MS = 1000;
const REFRESCO_DATOS_MS = 10000;

interface DatosSesion {
  campana: Campana;
  mapas: Mapa[];
  mapa: MapaConFichas | null;
  participantes: Participante[];
  npcs: NpcCampana[];
}

async function cargarSesionCompleta(campanaId: number): Promise<DatosSesion> {
  const [campana, mapas, participantes, npcsCampana] = await Promise.all([
    campanaService.obtener(campanaId),
    mapaService.deCampana(campanaId),
    campanaService.participantes(campanaId).catch(() => []),
    npcCampanaService.listar(campanaId).catch(() => []),
  ]);

  const enJuego = mapas.find((m) => m.estado === 'en_juego');
  const mapa = enJuego ? await mapaService.conFichas(enJuego.id) : null;

  return { campana, mapas, mapa, participantes, npcs: npcsCampana };
}

export function Sesion() {
  const { id } = useParams();
  const campanaId = Number(id);
  const { usuario } = useAuth();
  const usuarioId = usuario?.id ?? 0;

  const { data, error, loading, recargar } = useApi(`sesion-${campanaId}`, () =>
    cargarSesionCompleta(campanaId)
  );

  // undefined usa el mapa inicial; null indica que no hay mapa.
  const [mapaVista, setMapaVista] = useState<MapaConFichas | null | undefined>(undefined);

  const mapaActual = mapaVista === undefined ? data?.mapa ?? null : mapaVista;
  const mapaActualId = mapaActual?.id;

  const [npcsActuales, setNpcsActuales] = useState<NpcCampana[] | null>(null);

  // null hace que el master siga el mapa "en_juego".
  const [idMapaSeleccionado, setIdMapaSeleccionado] = useState<number | null>(null);

  const [fichaSeleccionadaId, setFichaSeleccionadaId] = useState<number | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [activando, setActivando] = useState(false);

  const esMaster = data ? data.campana.usuarioId === usuarioId : false;

  // Sondeo rápido para sincronizar mapa y fichas entre participantes.
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const mapas = await mapaService.deCampana(campanaId);
        const enJuego = mapas.find((m) => m.estado === 'en_juego');

        // Los jugadores siguen el mapa en juego; el master puede previsualizar otro.
        const idAMostrar = (esMaster ? idMapaSeleccionado : null) ?? enJuego?.id;

        if (!idAMostrar) {
          if (mapaActualId !== undefined) {
            setMapaVista(null);
          }
          return;
        }

        const mapaActualizado = await mapaService.conFichas(idAMostrar);
        setMapaVista(mapaActualizado);

        if (esMaster) setNpcsActuales(await npcCampanaService.listar(campanaId));
      } catch {
        // No se hace nada; el sondeo es solo para mantener la vista actualizada.
      }
    }, REFRESCO_FICHAS_MS);

    return () => clearInterval(timer);
  }, [ campanaId, esMaster, idMapaSeleccionado, mapaActualId ]);

  // Sondeo lento para recargar datos generales de la sesión.
  useEffect(() => {
    const timer = setInterval(() => {
      recargar();
    }, REFRESCO_DATOS_MS);

    return () => clearInterval(timer);
  }, [recargar]);

  if (loading) return <Cargando pagina />;

  if (error || !data) {
    return (
      <ErrorPagina
        mensaje={error?.message ?? 'No se pudo cargar la sesión'}
        volverA={`/campanas/${campanaId}`}
        textoVolver="← Volver a la campaña"
      />
    );
  }

  const { campana, mapas, participantes, npcs } = data;
  const listaNpcs = npcsActuales ?? npcs;
  const mapa = mapaActual;
  const campanaFinalizada = campana.estado === 'finalizada';

  const handleVerOtroMapa = async (nuevoId: number) => {
    if (!nuevoId) return;

    setIdMapaSeleccionado(nuevoId);
    setFichaSeleccionadaId(null);

    try {
      const mapaCargado = await mapaService.conFichas(nuevoId);
      setMapaVista(mapaCargado);
    } catch (err) {
      setErrorAccion(err instanceof Error ? err.message : 'Error al cargar el mapa');
    }
  };

  const handlePonerEnJuego = async () => {
    if (!mapa) return;

    setErrorAccion(null);
    setActivando(true);

    try {
      await mapaService.activar(mapa.id);
      setIdMapaSeleccionado(null);
      setMapaVista(undefined);
      recargar();
    } catch (err) {
      setErrorAccion(err instanceof Error ? err.message : 'No se pudo poner el mapa en juego.');
    } finally {
      setActivando(false);
    }
  };

  const handleMoverFicha = async (fichaId: number, destinoX: number, destinoY: number) => {
    setErrorAccion(null);
    setFichaSeleccionadaId(fichaId);

    if (mapa) {
      setMapaVista({
        ...mapa,
        fichas: mapa.fichas.map((f) =>
          f.id === fichaId ? { ...f, posicionX: destinoX, posicionY: destinoY } : f
        ),
      });
    }

    try {
      await fichaService.mover(fichaId, {
        posicionX: destinoX,
        posicionY: destinoY,
      });
    } catch (err) {
      setErrorAccion(err instanceof Error ? err.message : 'No se pudo mover la ficha.');
      recargar();
    }
  };

  const handleColocarFicha = async (datos: {
    npcCampanaId?: number;
    personajeCampanaId?: number;
  }) => {
    if (!mapa) return;

    setErrorAccion(null);

    let posX = 0;
    let posY = 0;

    while (mapa.fichas.some((f) => f.posicionX === posX && f.posicionY === posY)) {
      posX++;

      if (posX >= mapa.columnas) {
        posX = 0;
        posY++;
      }

      if (posY >= mapa.filas) break;
    }

    try {
      const nuevaFicha = await fichaService.colocar(mapa.id, {
        posicionX: posX,
        posicionY: posY,
        ...datos,
      });

      setFichaSeleccionadaId(nuevaFicha.id);

      const mapaActualizado = await mapaService.conFichas(mapa.id);
      setMapaVista(mapaActualizado);
    } catch (err) {
      setErrorAccion(err instanceof Error ? err.message : 'No se pudo colocar la ficha.');
    }
  };

  const handleEliminarFicha = async (fichaId: number) => {
    try {
      await fichaService.eliminar(fichaId);
      setFichaSeleccionadaId(null);

      if (mapa) {
        setMapaVista({
          ...mapa,
          fichas: mapa.fichas.filter((f) => f.id !== fichaId),
        });
      }
    } catch (err) {
      setErrorAccion(err instanceof Error ? err.message : 'No se pudo quitar la ficha.');
    }
  };

  const estaEnJuego = mapas.find((m) => m.id === mapa?.id)?.estado === 'en_juego';

  const handleNpcActualizado = async () => {
  try {
    const npcsActualizados = await npcCampanaService.listar(campanaId);
    setNpcsActuales(npcsActualizados);
  } catch (err) {
    setErrorAccion(
      err instanceof Error
        ? err.message
        : 'No se pudieron actualizar los NPCs'
    );
  }
};

  return (
    <main className="container-fluid py-3 px-md-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Link to={`/campanas/${campana.id}`} className="text-decoration-none">
          ← Volver a la campaña
        </Link>
      </div>

      {errorAccion && (
        <div className="alert alert-danger alert-dismissible py-2 mb-2" role="alert">
          {errorAccion}
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorAccion(null)}
          />
        </div>
      )}

      {!mapa ? (
        <div className="alert alert-info">
          <h5>No hay ningún mapa en juego</h5>
          <p className="mb-2">
            {esMaster
              ? 'Elegí un mapa existente o creá uno nuevo para ponerlo en juego en la sesión.'
              : 'El Master todavía no puso ningún mapa en juego para esta partida.'}
          </p>

          {esMaster && (
            <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
              {mapas.length > 0 && (
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    defaultValue=""
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      if (id) {
                        mapaService.activar(id).then(() => recargar());
                      }
                    }}
                  >
                    <option value="" disabled>
                      Seleccionar mapa para la sesión...
                    </option>
                    {mapas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre} ({m.columnas}x{m.filas})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Link to={`/campanas/${campana.id}/mapas/nuevo`} className="btn btn-primary btn-sm">
                <i className="bi bi-plus-lg me-1" />
                Crear mapa
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="row g-4 align-items-start">
          <div className="col-lg-4 col-md-5">
            <PanelSesion
              campanaId={campanaId}
              fichas={mapa.fichas}
              participantes={participantes}
              npcs={listaNpcs}
              usuarioId={usuarioId}
              esMaster={esMaster}
              campanaFinalizada={campanaFinalizada}
              fichaSeleccionadaId={fichaSeleccionadaId}
              onSeleccionarFicha={setFichaSeleccionadaId}
              onColocarFicha={handleColocarFicha}
              onEliminarFicha={handleEliminarFicha}
              onParticipanteActualizado={recargar}
              onNpcActualizado={handleNpcActualizado}
            />
          </div>

          <div className="col-lg-8 col-md-7">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <div className="d-flex align-items-baseline gap-2">
                <h4 className="mb-0 fw-bold">{mapa.nombre}</h4>
                <small className="text-body-secondary">
                  {mapa.columnas} × {mapa.filas} celdas
                </small>
                {estaEnJuego && <span className="badge bg-success">En juego</span>}
              </div>

              {esMaster && !campanaFinalizada && mapas.length > 0 && (
                <div className="d-flex align-items-center gap-2">
                  {mapas.length > 1 && (
                    <>
                      <label className="small text-body-secondary text-nowrap">
                        Cambiar mapa:
                      </label>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }}
                        value={mapa.id}
                        onChange={(e) => handleVerOtroMapa(Number(e.target.value))}
                      >
                        {mapas.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nombre} {m.estado === 'en_juego' ? '(En juego)' : ''}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  {!estaEnJuego && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handlePonerEnJuego}
                      disabled={activando}
                    >
                      <i className="bi bi-play-fill me-1" />
                      {activando ? 'Activando...' : 'Poner en juego'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {mapa.descripcion && (
              <p className="text-body-secondary small mb-2">{mapa.descripcion}</p>
            )}

            <TableroMapa
              mapa={mapa}
              usuarioId={usuarioId}
              esMaster={esMaster}
              campanaFinalizada={campanaFinalizada}
              fichaSeleccionadaId={fichaSeleccionadaId}
              onSeleccionarFicha={setFichaSeleccionadaId}
              onMoverFicha={handleMoverFicha}
            />
          </div>
        </div>
      )}
    </main>
  );
}
