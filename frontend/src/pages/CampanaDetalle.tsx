import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { ErrorPagina } from '../components/ErrorPagina';
import { EstadoBadge } from '../components/EstadoBadge';
import { ImagenPortada } from '../components/ImagenPortada';
import { ListaParticipantes } from '../components/ListaParticipantes';
import { ModalUnirse } from '../components/ModalUnirse';
import { RolBadge } from '../components/RolBadge';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { ApiError } from '../services/api';
import { campanaService, type Campana, type Participante } from '../services/campana.service';
import { personajeService, type PersonajeJugable } from '../services/personaje.service';

interface Detalle {
  campana: Campana;
  esMaster: boolean;
  // null = el usuario no participa (la API solo le muestra los participantes al master y a los jugadores)
  participantes: Participante[] | null;
  personajes: PersonajeJugable[];
}

async function cargarDetalle(campanaId: number, usuarioId: number): Promise<Detalle> {
  const campana = await campanaService.obtener(campanaId);
  const esMaster = campana.master.id === usuarioId;

  const [participantes, personajes] = await Promise.all([
    campanaService.participantes(campanaId).catch((err: unknown) => {
      if (err instanceof ApiError && err.status === 403) return null;
      throw err;
    }),
    // El master no puede participar como jugador, no necesita sus personajes
    esMaster ? Promise.resolve([]) : personajeService.mios(),
  ]);

  return { campana, esMaster, participantes, personajes };
}

export function CampanaDetalle() {
  const { id } = useParams();
  const campanaId = Number(id);
  const { usuario } = useAuth();
  const usuarioId = usuario?.id ?? 0;

  const { data, error, loading, recargar } = useApi(`detalle-${campanaId}-${usuarioId}`, () =>
    cargarDetalle(campanaId, usuarioId)
  );

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (loading) return <Cargando pagina />;

  if (error || !data) {
    return (
      <ErrorPagina
        mensaje={error?.message ?? 'No se pudo cargar la campaña'}
        volverA="/campanas"
        textoVolver="← Volver a las campañas"
      />
    );
  }

  const { campana, esMaster, participantes, personajes } = data;
  const participa = !esMaster && participantes !== null;
  const puedeEntrar = esMaster || participa;
  const finalizada = campana.estado === 'finalizada';

  // Los personajes que ya están en la campaña no se pueden volver a sumar
  const disponibles = personajes.filter((p) => !participantes?.some((part) => part.personajeId === p.id));
  const puedeUnirse = !esMaster && !finalizada && disponibles.length > 0;

  let avisoUnirse: string | null = null;
  if (!esMaster && !finalizada) {
    if (personajes.length === 0) {
      avisoUnirse = 'Para unirte necesitás tener al menos un personaje jugable creado.';
    } else if (disponibles.length === 0) {
      avisoUnirse = 'Todos tus personajes jugables ya participan en esta campaña.';
    }
  }

  return (
    <main className="container py-4">
      <Link to="/campanas" className="d-inline-block mb-3">
        ← Volver a las campañas
      </Link>

      {mensaje && (
        <div className="alert alert-success alert-dismissible" role="alert">
          {mensaje}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setMensaje(null)} />
        </div>
      )}

      <div className="card mb-4">
        <ImagenPortada url={campana.imagenUrl} alt={campana.nombre} alto={280} />

        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
            <h2 className="card-title mb-1">{campana.nombre}</h2>
            <div className="d-flex gap-2">
              <EstadoBadge estado={campana.estado} />
              {esMaster && <RolBadge rol="master" />}
              {participa && <RolBadge rol="jugador" />}
            </div>
          </div>

          <p className="text-body-secondary">
            <i className="bi bi-person-fill me-1" />
            Master: {campana.master.nombre}
          </p>

          {campana.descripcion && <p>{campana.descripcion}</p>}

          {finalizada && !esMaster && (
            <div className="alert alert-secondary">
              La campaña está finalizada, ya no se pueden sumar personajes.
            </div>
          )}
          {avisoUnirse && <div className="alert alert-warning">{avisoUnirse}</div>}

          <div className="d-flex flex-wrap gap-2">
            {!esMaster && (
              <button
                className="btn btn-primary"
                disabled={!puedeUnirse}
                onClick={() => setModalAbierto(true)}
              >
                <i className="bi bi-person-plus me-1" />
                {participa ? 'Sumar otro personaje' : 'Unirse'}
              </button>
            )}

            {puedeEntrar ? (
              <Link to={`/campanas/${campana.id}/sesion`} className="btn btn-success">
                <i className="bi bi-play-fill me-1" />
                Entrar a la sesión
              </Link>
            ) : (
              <button
                className="btn btn-success"
                disabled
                title="Unite a la campaña con un personaje para poder entrar a la sesión"
              >
                <i className="bi bi-play-fill me-1" />
                Entrar a la sesión
              </button>
            )}
          </div>
        </div>
      </div>

      {participantes && (
        <section>
          <h4 className="mb-3">Participantes</h4>
          <ListaParticipantes participantes={participantes} />
        </section>
      )}

      {modalAbierto && (
        <ModalUnirse
          campanaId={campana.id}
          personajes={disponibles}
          onCerrar={() => setModalAbierto(false)}
          onUnido={() => {
            setModalAbierto(false);
            setMensaje('¡Listo! Tu personaje ya participa en la campaña.');
            recargar();
          }}
        />
      )}
    </main>
  );
}
