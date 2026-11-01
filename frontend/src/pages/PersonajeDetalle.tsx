import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AgresionBadge } from '../components/Badges';
import { Cargando } from '../components/Cargando';
import { ErrorAlert } from '../components/ErrorAlert';
import { ErrorPagina } from '../components/ErrorPagina';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { personajeService } from '../services/personaje.service';
import { mensajeError } from '../utils/form';

const ESTADISTICAS = [
  ['fuerza', 'Fuerza'],
  ['destreza', 'Destreza'],
  ['constitucion', 'Constitución'],
  ['inteligencia', 'Inteligencia'],
  ['sabiduria', 'Sabiduría'],
  ['carisma', 'Carisma'],
] as const;

export function PersonajeDetalle() {
  const { id } = useParams();
  const personajeId = Number(id);
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const { data: p, error, loading: cargando } = useApi(`personaje-${personajeId}`, () =>
    personajeService.obtener(personajeId)
  );
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  if (cargando) return <Cargando pagina />;
  if (error || !p) {
    return <ErrorPagina mensaje={error?.message ?? 'Personaje no encontrado'} volverA="/personajes" textoVolver="← Volver a mis personajes" />;
  }

  const esJugable = p.tipo === 'jugable';
  // Un jugable lo modifica su creador; un NPC, el master de su campaña
  const puedeEditar = esJugable ? p.usuarioId === usuario?.id : p.campana?.usuarioId === usuario?.id;
  const campanasActivas = p.instancias.filter((i) => i.activo);

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar a ${p.nombre}?`)) return;

    setErrorAccion(null);
    try {
      await personajeService.eliminar(p.id);
      navigate(esJugable ? '/personajes' : `/campanas/${p.campanaId}`);
    } catch (err) {
      setErrorAccion(mensajeError(err));
    }
  };

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2 className="mb-1">
            {p.nombre}{' '}
            <span className="badge bg-secondary">{esJugable ? 'Jugable' : 'NPC'}</span>{' '}
            {!esJugable && <AgresionBadge estado={p.estadoAgresion} />}
          </h2>
          <small className="text-body-secondary">
            {[p.especie, p.clase, p.nivel ? `Nivel ${p.nivel}` : null].filter(Boolean).join(' · ')}
          </small>
        </div>

        {puedeEditar && (
          <div className="d-flex gap-2">
            <Link to={`/personajes/${p.id}/editar`} className="btn btn-outline-secondary btn-sm">Editar</Link>
            <button onClick={eliminar} className="btn btn-outline-danger btn-sm">Eliminar</button>
          </div>
        )}
      </div>

      {errorAccion && <ErrorAlert mensaje={errorAccion} />}
      {p.descripcion && <p>{p.descripcion}</p>}

      <div className="row g-4">
        <div className="col-md-6">
          <h5>Estadísticas</h5>
          <table className="table table-sm">
            <tbody>
              {ESTADISTICAS.map(([clave, etiqueta]) => (
                <tr key={clave}>
                  <th scope="row">{etiqueta}</th>
                  <td>{p[clave] ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h5>Atributos</h5>
          <table className="table table-sm">
            <tbody>
              <tr><th scope="row">Vida máxima</th><td>{p.vidaMax ?? '—'}</td></tr>
              <tr><th scope="row">Armadura</th><td>{p.armadura ?? '—'}</td></tr>
              <tr><th scope="row">Iniciativa</th><td>{p.iniciativa ?? '—'}</td></tr>
              <tr><th scope="row">Velocidad</th><td>{p.velocidad ?? '—'}</td></tr>
              {esJugable && (
                <>
                  <tr><th scope="row">Maná máximo</th><td>{p.manaMax ?? '—'}</td></tr>
                  <tr><th scope="row">Experiencia</th><td>{p.experiencia ?? '—'}</td></tr>
                  <tr><th scope="row">Oro</th><td>{p.oro ?? '—'}</td></tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {esJugable && (
        <section className="mt-3">
          <h5>Campañas en las que participa</h5>
          {campanasActivas.length === 0 ? (
            <p className="text-body-secondary">Todavía no participa en ninguna campaña.</p>
          ) : (
            <ul>
              {campanasActivas.map((i) => (
                <li key={i.id}><Link to={`/campanas/${i.campanaId}`}>Campaña #{i.campanaId}</Link></li>
              ))}
            </ul>
          )}
        </section>
      )}

      {!esJugable && p.campana && (
        <p className="mt-3">
          Pertenece a la campaña <Link to={`/campanas/${p.campana.id}`}>{p.campana.nombre}</Link>.
        </p>
      )}
    </main>
  );
}
