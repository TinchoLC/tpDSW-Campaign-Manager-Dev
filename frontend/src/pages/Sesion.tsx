import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { ErrorPagina } from '../components/ErrorPagina';
import { EstadoBadge } from '../components/EstadoBadge';
import { ListaFichas } from '../components/ListaFichas';
import { TableroMapa } from '../components/TableroMapa';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { campanaService, type Campana } from '../services/campana.service';
import { mapaService, type MapaConFichas } from '../services/mapa.service';

// Cada cuánto se vuelve a pedir el mapa, para ver cómo el master mueve las fichas
const REFRESCO_MS = 5000;

interface DatosSesion {
  campana: Campana;
  mapa: MapaConFichas | null; // null = el master no puso ningún mapa en juego
}

async function cargarSesion(campanaId: number): Promise<DatosSesion> {
  const [campana, mapas] = await Promise.all([
    campanaService.obtener(campanaId),
    mapaService.deCampana(campanaId),
  ]);

  const enJuego = mapas.find((m) => m.estado === 'en_juego');
  const mapa = enJuego ? await mapaService.conFichas(enJuego.id) : null;

  return { campana, mapa };
}

export function Sesion() {
  const { id } = useParams();
  const campanaId = Number(id);
  const { usuario } = useAuth();
  const usuarioId = usuario?.id ?? 0;

  const { data, error, loading, recargar } = useApi(`sesion-${campanaId}`, () => cargarSesion(campanaId));

  useEffect(() => {
    const timer = setInterval(recargar, REFRESCO_MS);
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

  const { campana, mapa } = data;

  return (
    <main className="container-fluid py-4 px-md-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <Link to={`/campanas/${campana.id}`}>← Volver a la campaña</Link>
          <h3 className="mb-0 mt-1">
            {campana.nombre} <EstadoBadge estado={campana.estado} />
          </h3>
        </div>

        <div className="d-flex align-items-center gap-3">
          <small className="text-body-secondary">Se actualiza cada {REFRESCO_MS / 1000} segundos</small>
          <button className="btn btn-outline-secondary btn-sm" onClick={recargar}>
            <i className="bi bi-arrow-clockwise me-1" />
            Actualizar
          </button>
        </div>
      </div>

      {!mapa ? (
        <div className="alert alert-info">El master todavía no puso ningún mapa en juego.</div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-9">
            <h5 className="mb-1">{mapa.nombre}</h5>
            {mapa.descripcion && <p className="text-body-secondary">{mapa.descripcion}</p>}
            <TableroMapa mapa={mapa} usuarioId={usuarioId} />
          </div>

          <div className="col-lg-3">
            <h5>Fichas en el mapa</h5>
            <ListaFichas fichas={mapa.fichas} usuarioId={usuarioId} />
          </div>
        </div>
      )}
    </main>
  );
}
