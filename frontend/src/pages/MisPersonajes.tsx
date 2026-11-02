import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Cargando } from '../components/Cargando';
import { ErrorAlert } from '../components/ErrorAlert';
import { useApi } from '../hooks/useApi';
import { personajeService, type Personaje } from '../services/personaje.service';
import { mensajeError } from '../utils/form';
import { useConfirmar } from '../hooks/useConfirmar';

export function MisPersonajes() {
  const { data: datos, error, loading: cargando, recargar } = useApi('personajes-mios', personajeService.mios);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const { confirmar, dialogo } = useConfirmar();
  const eliminar = async (p: Personaje) => {
    if (!(await confirmar({
      titulo: 'Eliminar personaje',
      mensaje: `¿Eliminar a ${p.nombre}? También deja de participar en sus campañas.`,
      textoConfirmar: 'Eliminar'
    }))) return;
    setErrorAccion(null);
    try {
      await personajeService.eliminar(p.id);
      recargar();
    } catch (err) {
      setErrorAccion(mensajeError(err));
    }
  };

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Mis personajes</h2>
        <Link to="/personajes/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>Nuevo personaje
        </Link>
      </div>

      {cargando && <Cargando />}
      {error && <ErrorAlert mensaje={error.message} />}
      {errorAccion && <ErrorAlert mensaje={errorAccion} />}

      {datos && datos.length === 0 && (
        <p className="text-body-secondary">Todavía no creaste ningún personaje.</p>
      )}

      {datos && datos.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {datos.map((p) => (
            <div key={p.id} className="col">
              <div className="card h-100">
                <div className="card-body d-flex gap-3 align-items-start">
                  <Avatar url={p.imagenUrl} nombre={p.nombre} tamanio={54} />
                  <div className="flex-grow-1">
                    <h5 className="card-title mb-1">{p.nombre}</h5>
                    <h6 className="card-subtitle mb-2 text-body-secondary">
                      {[p.especie, p.clase, p.nivel ? `Nivel ${p.nivel}` : null].filter(Boolean).join(' · ') || 'Sin datos'}
                    </h6>
                    {p.descripcion && <p className="card-text small mb-0">{p.descripcion}</p>}
                  </div>
                </div>
                <div className="card-footer d-flex gap-2">
                  <Link to={`/personajes/${p.id}`} className="btn btn-outline-primary btn-sm">Ver</Link>
                  <Link to={`/personajes/${p.id}/editar`} className="btn btn-outline-secondary btn-sm">Editar</Link>
                  <button onClick={() => eliminar(p)} className="btn btn-outline-danger btn-sm ms-auto">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {dialogo}
    </main>
  );
}
