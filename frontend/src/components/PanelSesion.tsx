import { useEffect, useState } from 'react';
import type { Ficha } from '../services/mapa.service';
import type { Participante } from '../services/campana.service';
import { personajeService, type Personaje } from '../services/personaje.service';
import { colorDeFicha, esFichaDelUsuario, esNpc, estaCaida, imagenDeFicha, nombreDeFicha } from '../utils/ficha';

interface PanelSesionProps {
  fichas: Ficha[];
  participantes: Participante[];
  npcs: Personaje[];
  usuarioId: number;
  esMaster: boolean;
  campanaFinalizada: boolean;
  fichaSeleccionadaId: number | null;
  onSeleccionarFicha: (id: number | null) => void;
  onColocarFicha: (datos: { personajeId?: number; personajeCampanaId?: number }) => void;
  onEliminarFicha?: (id: number) => void;
}

export function PanelSesion({
  fichas,
  participantes,
  npcs,
  usuarioId,
  esMaster,
  campanaFinalizada,
  fichaSeleccionadaId,
  onSeleccionarFicha,
  onColocarFicha,
  onEliminarFicha,
}: PanelSesionProps) {
  const [tab, setTab] = useState<'detalle' | 'fichas' | 'chat' | 'notas'>('fichas');

  const fichaSeleccionada = fichas.find((f) => f.id === fichaSeleccionadaId);

  // Buscar datos del participante o NPC seleccionado
  const participanteInfo = fichaSeleccionada?.personajeCampana
    ? participantes.find((p) => p.id === fichaSeleccionada.personajeCampana?.id)
    : null;

  const [personajeJugableDetalle, setPersonajeJugableDetalle] = useState<Personaje | null>(null);

  useEffect(() => {
    if (!participanteInfo?.personajeId) {
      setPersonajeJugableDetalle(null);
      return;
    }
    let cancelado = false;
    personajeService
      .obtener(participanteInfo.personajeId)
      .then((p) => {
        if (!cancelado) setPersonajeJugableDetalle(p);
      })
      .catch(() => {
        if (!cancelado) setPersonajeJugableDetalle(null);
      });
    return () => {
      cancelado = true;
    };
  }, [participanteInfo?.personajeId]);

  const npcInfo = fichaSeleccionada?.personaje
    ? npcs.find((n) => n.id === fichaSeleccionada.personaje?.id)
    : null;

  // Filtrar los que NO están en el mapa todavía
  const participantesDisponibles = participantes.filter(
    (p) => !fichas.some((f) => f.personajeCampana?.id === p.id) && (esMaster || p.personaje.usuario.id === usuarioId)
  );

  const npcsDisponibles = esMaster
    ? npcs.filter((n) => !fichas.some((f) => f.personaje?.id === n.id))
    : [];

  return (
    <div className="card shadow-sm h-100 d-flex flex-column" style={{ maxHeight: '78vh' }}>
      {/* Pestañas: Detalle - Fichas - Chat - Notas */}
      <div className="card-header bg-body-tertiary">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'detalle' ? 'active fw-bold' : ''}`}
              onClick={() => setTab('detalle')}
            >
              Detalle
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'fichas' ? 'active fw-bold' : ''}`}
              onClick={() => setTab('fichas')}
            >
              Fichas ({fichas.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'chat' ? 'active fw-bold' : ''}`}
              onClick={() => setTab('chat')}
            >
              Chat
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'notas' ? 'active fw-bold' : ''}`}
              onClick={() => setTab('notas')}
            >
              Notas
            </button>
          </li>
        </ul>
      </div>

      <div className="card-body p-3 overflow-auto">
        {/* PESTAÑA: DETALLE */}
        {tab === 'detalle' && (
          <div>
            {!fichaSeleccionada ? (
              <div className="text-center py-4 text-body-secondary">
                <i className="bi bi-cursor fs-2 d-block mb-2 text-secondary" />
                <p className="small mb-0">Hacé clic o arrastrá una ficha en el mapa para ver su información completa.</p>
              </div>
            ) : (
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  {imagenDeFicha(fichaSeleccionada) ? (
                    <img
                      src={imagenDeFicha(fichaSeleccionada)!}
                      alt={nombreDeFicha(fichaSeleccionada)}
                      className="rounded-circle border"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: colorDeFicha(nombreDeFicha(fichaSeleccionada)),
                      }}
                    >
                      {nombreDeFicha(fichaSeleccionada).slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h5 className="mb-0 fw-bold">{nombreDeFicha(fichaSeleccionada)}</h5>
                    <span className="badge bg-secondary">
                      {esNpc(fichaSeleccionada) ? 'NPC' : 'Personaje'}
                    </span>
                  </div>
                </div>

                {/* 1. SI ES PERSONAJE JUGABLE */}
                {participanteInfo && (
                  <div>
                    <div className="list-group list-group-flush mb-3 small">
                      <div className="list-group-item px-0 py-1 d-flex justify-content-between">
                        <span className="text-body-secondary">Dueño (Cuenta):</span>
                        <span className="fw-semibold">{participanteInfo.personaje.usuario.nombre}</span>
                      </div>
                      {personajeJugableDetalle?.especie && (
                        <div className="list-group-item px-0 py-1 d-flex justify-content-between">
                          <span className="text-body-secondary">Especie:</span>
                          <span className="fw-semibold">{personajeJugableDetalle.especie}</span>
                        </div>
                      )}
                      {(participanteInfo.clase ?? personajeJugableDetalle?.clase) && (
                        <div className="list-group-item px-0 py-1 d-flex justify-content-between">
                          <span className="text-body-secondary">Clase:</span>
                          <span className="fw-semibold">{participanteInfo.clase ?? personajeJugableDetalle?.clase}</span>
                        </div>
                      )}
                      <div className="list-group-item px-0 py-1 d-flex justify-content-between">
                        <span className="text-body-secondary">Nivel:</span>
                        <span className="fw-semibold">{participanteInfo.nivel ?? personajeJugableDetalle?.nivel ?? 1}</span>
                      </div>
                    </div>

                    <h6 className="fw-bold small text-body-secondary mb-1">Combate y recursos</h6>
                    <div className="row g-1 text-center small mb-3">
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Vida</small>
                          <strong className="text-danger">
                            {participanteInfo.vidaMax ?? personajeJugableDetalle?.vidaMax ?? '—'}
                          </strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Armadura</small>
                          <strong>{personajeJugableDetalle?.armadura ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Iniciativa</small>
                          <strong>{personajeJugableDetalle?.iniciativa ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Velocidad</small>
                          <strong>{personajeJugableDetalle?.velocidad ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Maná máx.</small>
                          <strong>{personajeJugableDetalle?.manaMax ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Oro / Exp.</small>
                          <strong>
                            {personajeJugableDetalle?.oro ?? 0} / {personajeJugableDetalle?.experiencia ?? 0}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold small text-body-secondary mb-1">Atributos</h6>
                    <div className="row g-1 text-center small mb-3">
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Fuerza</small>
                          <strong>{personajeJugableDetalle?.fuerza ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Destreza</small>
                          <strong>{personajeJugableDetalle?.destreza ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Constitución</small>
                          <strong>{personajeJugableDetalle?.constitucion ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Inteligencia</small>
                          <strong>{personajeJugableDetalle?.inteligencia ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Sabiduría</small>
                          <strong>{personajeJugableDetalle?.sabiduria ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Carisma</small>
                          <strong>{personajeJugableDetalle?.carisma ?? '—'}</strong>
                        </div>
                      </div>
                    </div>

                    {personajeJugableDetalle?.descripcion && (
                      <p className="small text-body-secondary border-top pt-2 mb-2">
                        {personajeJugableDetalle.descripcion}
                      </p>
                    )}
                  </div>
                )}

                {/* 2. SI ES NPC */}
                {npcInfo && (
                  <div>
                    <h6 className="fw-bold small text-body-secondary mb-1">Combate</h6>
                    <div className="row g-1 text-center small mb-3">
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Vida</small>
                          <strong className="text-danger">
                            {npcInfo.vidaMax} / {npcInfo.vidaMax}
                          </strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Armadura</small>
                          <strong>{npcInfo.armadura ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Iniciativa</small>
                          <strong>{npcInfo.iniciativa ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-6 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Velocidad</small>
                          <strong>{npcInfo.velocidad ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-6 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Comportamiento</small>
                          <strong className="text-capitalize">{npcInfo.estadoAgresion ?? '—'}</strong>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold small text-body-secondary mb-1">Atributos</h6>
                    <div className="row g-1 text-center small mb-3">
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Fuerza</small>
                          <strong>{npcInfo.fuerza ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Destreza</small>
                          <strong>{npcInfo.destreza ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Constitución</small>
                          <strong>{npcInfo.constitucion ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Inteligencia</small>
                          <strong>{npcInfo.inteligencia ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Sabiduría</small>
                          <strong>{npcInfo.sabiduria ?? '—'}</strong>
                        </div>
                      </div>
                      <div className="col-4 mt-1">
                        <div className="bg-body-tertiary p-1 rounded border">
                          <small className="text-body-secondary d-block">Carisma</small>
                          <strong>{npcInfo.carisma ?? '—'}</strong>
                        </div>
                      </div>
                    </div>

                    {npcInfo.descripcion && (
                      <p className="small text-body-secondary border-top pt-2 mb-2">
                        {npcInfo.descripcion}
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-body-tertiary p-2 rounded small mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-body-secondary">Posición en Grilla:</span>
                    <span className="fw-semibold">
                      Columna {fichaSeleccionada.posicionX + 1}, Fila {fichaSeleccionada.posicionY + 1}
                    </span>
                  </div>
                  {estaCaida(fichaSeleccionada) && (
                    <div className="text-danger mt-1">
                      Esta ficha no puede moverse porque está inconsciente o muerta.
                    </div>
                  )}
                </div>

                {esMaster && !campanaFinalizada && onEliminarFicha && (
                  <button
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={() => onEliminarFicha(fichaSeleccionada.id)}
                  >
                    <i className="bi bi-trash me-1" />
                    Quitar del mapa
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: FICHAS (En mapa + Disponibles para colocar) */}
        {tab === 'fichas' && (
          <div>
            {!campanaFinalizada && (participantesDisponibles.length > 0 || npcsDisponibles.length > 0) && (
              <div className="mb-3 pb-3 border-bottom">
                <h6 className="fw-bold text-success small mb-2">
                  <i className="bi bi-plus-circle me-1" />
                  Fichas disponibles para colocar
                </h6>

                {participantesDisponibles.length > 0 && (
                  <div className="mb-2">
                    <small className="text-body-secondary fw-semibold d-block mb-1">Personajes:</small>
                    <div className="d-flex flex-wrap gap-1">
                      {participantesDisponibles.map((p) => (
                        <button
                          key={p.id}
                          className="btn btn-sm btn-outline-success text-start"
                          onClick={() => onColocarFicha({ personajeCampanaId: p.id })}
                          title="Hacé clic para colocar en el mapa"
                        >
                          + {p.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {npcsDisponibles.length > 0 && (
                  <div>
                    <small className="text-body-secondary fw-semibold d-block mb-1">NPCs:</small>
                    <div className="d-flex flex-wrap gap-1">
                      {npcsDisponibles.map((n) => (
                        <button
                          key={n.id}
                          className="btn btn-sm btn-outline-warning text-dark text-start"
                          onClick={() => onColocarFicha({ personajeId: n.id })}
                          title="Hacé clic para colocar en el mapa"
                        >
                          + {n.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <h6 className="fw-semibold text-body-secondary small mb-2">
              Fichas en el mapa ({fichas.length})
            </h6>

            {fichas.length === 0 ? (
              <p className="text-body-secondary small mb-0">Todavía no hay fichas en el mapa.</p>
            ) : (
              <div className="list-group list-group-flush">
                {fichas.map((f) => {
                  const seleccionada = f.id === fichaSeleccionadaId;
                  const tipo = esNpc(f) ? 'NPC' : esFichaDelUsuario(f, usuarioId) ? 'Tu ficha' : 'Jugador';

                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-2 py-2 ${
                        seleccionada ? 'active' : ''
                      }`}
                      onClick={() => {
                        onSeleccionarFicha(f.id);
                        setTab('detalle');
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        {imagenDeFicha(f) ? (
                          <img
                            src={imagenDeFicha(f)!}
                            alt=""
                            className="rounded-circle border"
                            style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: '28px',
                              height: '28px',
                              fontSize: '10px',
                              backgroundColor: colorDeFicha(nombreDeFicha(f)),
                            }}
                          >
                            {nombreDeFicha(f).slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold small leading-tight">{nombreDeFicha(f)}</div>
                          <small className={seleccionada ? 'text-white-50' : 'text-body-secondary'}>
                            {tipo}
                          </small>
                        </div>
                      </div>

                      <span className={`badge ${seleccionada ? 'bg-light text-dark' : 'bg-secondary'}`}>
                        {f.posicionX + 1}, {f.posicionY + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: CHAT */}
        {tab === 'chat' && (
          <div className="text-center py-5 text-body-secondary">
            <i className="bi bi-chat-dots fs-1 d-block mb-2 text-secondary" />
            <h6 className="fw-semibold">Chat de Sesión</h6>
            <p className="small mb-0">Próximamente disponible.</p>
          </div>
        )}

        {/* PESTAÑA: NOTAS */}
        {tab === 'notas' && (
          <div className="text-center py-5 text-body-secondary">
            <i className="bi bi-journal-text fs-1 d-block mb-2 text-secondary" />
            <h6 className="fw-semibold">Notas Compartidas</h6>
            <p className="small mb-0">Próximamente disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
}
