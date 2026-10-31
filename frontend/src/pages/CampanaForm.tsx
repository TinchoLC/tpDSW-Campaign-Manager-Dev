import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { ErrorAlert } from '../components/ErrorAlert';
import { ErrorPagina } from '../components/ErrorPagina';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { campanaService, type Campana, type CampanaInput } from '../services/campana.service';
import { mensajeError } from '../utils/form';

interface FormularioProps {
  titulo: string;
  inicial?: Campana;
  onGuardar: (datos: CampanaInput) => Promise<Campana>;
}

function Formulario({ titulo, inicial, onGuardar }: FormularioProps) {
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    setGuardando(true);
    try {
      const campana = await onGuardar({
        nombre: String(fd.get('nombre') || '').trim(),
        descripcion: String(fd.get('descripcion') || '').trim(),
      });
      navigate(`/campanas/${campana.id}`);
    } catch (err) {
      setError(mensajeError(err));
      setGuardando(false);
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">{titulo}</h2>

      {error && <ErrorAlert mensaje={error} />}

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input name="nombre" type="text" className="form-control" maxLength={100}
            defaultValue={inicial?.nombre} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-control" rows={4} maxLength={500}
            defaultValue={inicial?.descripcion ?? ''} />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            Guardar
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

function EditarCampana({ id }: { id: number }) {
  const { usuario } = useAuth();
  const { data: datos, error, loading: cargando } = useApi(`campana-${id}`, () => campanaService.obtener(id));

  if (cargando) return <Cargando pagina />;
  if (error || !datos) {
    return <ErrorPagina mensaje={error?.message ?? 'Campaña no encontrada'} volverA="/campanas" textoVolver="← Volver a las campañas" />;
  }
  if (datos.usuarioId !== usuario?.id) {
    return <ErrorPagina mensaje="Solo el master puede editar la campaña" volverA="/campanas" textoVolver="← Volver a las campañas" />;
  }

  return (
    <Formulario
      titulo="Editar campaña"
      inicial={datos}
      onGuardar={(cambios) => campanaService.actualizar(id, cambios)}
    />
  );
}

// /campanas/nueva crea; /campanas/:id/editar edita
export function CampanaForm() {
  const { id } = useParams();

  if (id) return <EditarCampana id={Number(id)} />;
  return <Formulario titulo="Nueva campaña" onGuardar={campanaService.crear} />;
}
