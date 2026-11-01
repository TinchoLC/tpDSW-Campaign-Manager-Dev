import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { ApiError } from '../services/api';
import { rasgoService, type Rasgo } from '../services/rasgo.service';
import { mensajeError, num, txt } from '../utils/form';
import { Cargando } from './Cargando';
import { ErrorAlert } from './ErrorAlert';

interface DatosRasgo {
  nombre: string;
  descripcion?: string;
  nivelMinimo?: number;
  visibleAJugador: boolean;
}

interface FormularioProps {
  inicial: Rasgo | null;
  onGuardar: (datos: DatosRasgo) => Promise<void>;
  onCancelar: () => void;
}

function RasgoFormulario({ inicial, onGuardar, onCancelar }: FormularioProps) {
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    setGuardando(true);
    try {
      await onGuardar({
        nombre: String(fd.get('nombre') || '').trim(),
        descripcion: txt(fd, 'descripcion'),
        nivelMinimo: num(fd, 'nivelMinimo'),
        // Un checkbox sin tildar no viaja en el FormData
        visibleAJugador: fd.get('visibleAJugador') === 'on',
      });
    } catch (err) {
      setError(mensajeError(err));
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-3">
      <h5>{inicial ? 'Editar rasgo' : 'Nuevo rasgo'}</h5>
      {error && <ErrorAlert mensaje={error} />}

      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label">Nombre</label>
          <input name="nombre" type="text" className="form-control" maxLength={100}
            defaultValue={inicial?.nombre} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Nivel mínimo</label>
          <input name="nivelMinimo" type="number" className="form-control" min={1}
            defaultValue={inicial?.nivelMinimo ?? ''} />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-control" rows={2} maxLength={500}
            defaultValue={inicial?.descripcion ?? ''} />
        </div>
        <div className="col-12">
          <div className="form-check">
            <input name="visibleAJugador" type="checkbox" className="form-check-input"
              id="visibleAJugador" defaultChecked={inicial?.visibleAJugador ?? true} />
            <label className="form-check-label" htmlFor="visibleAJugador">
              Visible para los jugadores
            </label>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          Guardar
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

interface Props {
  titulo: string;
  campanaId?: number; // sin campanaId se muestran solo los rasgos generales
  esMaster?: boolean; // master de la campaña (si se pasa campanaId)
}

// Lista y administra rasgos. Generales: solo los edita un admin. De campaña: solo su master.
export function RasgosPanel({ titulo, campanaId, esMaster = false }: Props) {
  const { usuario } = useAuth();
  const esAdmin = usuario?.tipo === 'admin';

  const { data: datos, error, loading: cargando, recargar } = useApi(
    `rasgos-${campanaId ?? 'generales'}`,
    () => rasgoService.listar(campanaId)
  );
  const [formulario, setFormulario] = useState<{ editando: Rasgo | null } | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const puedeCrear = campanaId === undefined ? esAdmin : esMaster;
  const puedeEditar = (r: Rasgo) => (r.campanaId === null ? esAdmin : esMaster);

  // 403 = el usuario no participa de la campaña, así que no ve sus rasgos
  const noDisponible = error instanceof ApiError && error.status === 403;

  const guardar = async (datos: DatosRasgo) => {
    const editando = formulario?.editando;

    if (editando) {
      await rasgoService.actualizar(editando.id, {
        nombre: datos.nombre,
        descripcion: datos.descripcion ?? null,
        nivelMinimo: datos.nivelMinimo ?? null,
        visibleAJugador: datos.visibleAJugador,
      });
    } else {
      await rasgoService.crear({ ...datos, campanaId });
    }

    setFormulario(null);
    recargar();
  };

  const eliminar = async (r: Rasgo) => {
    if (!window.confirm(`¿Eliminar el rasgo "${r.nombre}"?`)) return;
    setErrorAccion(null);
    try {
      await rasgoService.eliminar(r.id);
      recargar();
    } catch (err) {
      setErrorAccion(mensajeError(err));
    }
  };

  return (
    <section className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">{titulo}</h4>
        {puedeCrear && !formulario && (
          <button onClick={() => setFormulario({ editando: null })} className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1"></i>Nuevo rasgo
          </button>
        )}
      </div>

      {formulario && (
        <RasgoFormulario
          key={formulario.editando?.id ?? 'nuevo'}
          inicial={formulario.editando}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      {cargando && <Cargando />}
      {error && !noDisponible && <ErrorAlert mensaje={error.message} />}
      {errorAccion && <ErrorAlert mensaje={errorAccion} />}
      {noDisponible && (
        <p className="text-body-secondary">Los rasgos de la campaña solo los ven sus participantes.</p>
      )}

      {datos && datos.length === 0 && (
        <p className="text-body-secondary">No hay rasgos para mostrar.</p>
      )}

      {datos && datos.length > 0 && (
        <div className="list-group">
          {datos.map((r) => (
            <div key={r.id} className="list-group-item d-flex justify-content-between align-items-start gap-3">
              <div>
                <h6 className="mb-1">
                  {r.nombre}{' '}
                  <span className={`badge ${r.campanaId === null ? 'bg-secondary' : 'bg-primary'}`}>
                    {r.campanaId === null ? 'General' : 'De la campaña'}
                  </span>{' '}
                  {r.nivelMinimo && <span className="badge bg-info text-dark">Nivel {r.nivelMinimo}+</span>}{' '}
                  {!r.visibleAJugador && <span className="badge bg-warning text-dark">Oculto</span>}
                </h6>
                {r.descripcion && <p className="mb-0">{r.descripcion}</p>}
              </div>

              {puedeEditar(r) && (
                <div className="d-flex gap-2">
                  <button onClick={() => setFormulario({ editando: r })} className="btn btn-outline-secondary btn-sm">
                    Editar
                  </button>
                  <button onClick={() => eliminar(r)} className="btn btn-outline-danger btn-sm">
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
