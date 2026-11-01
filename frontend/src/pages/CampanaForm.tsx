import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { ErrorAlert } from '../components/ErrorAlert';
import { ErrorPagina } from '../components/ErrorPagina';
import { ImageUpload } from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { campanaService, type Campana, type CampanaInput } from '../services/campana.service';
import { mensajeError } from '../utils/form';

export function CampanaForm() {
  const { id } = useParams();
  const campanaId = id ? Number(id) : null;
  const esEdicion = Boolean(campanaId);

  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);

  const { data: inicial, error: errorCarga, loading } = useApi<Campana | null>(
    `campana-${campanaId ?? 'nueva'}`,
    () => (campanaId ? campanaService.obtener(campanaId) : Promise.resolve(null))
  );

  useEffect(() => {
    if (inicial) {
      setImagenUrl(inicial.imagenUrl ?? null);
    }
  }, [inicial]);

  if (loading) return <Cargando pagina />;

  if (esEdicion) {
    if (errorCarga || !inicial) {
      return (
        <ErrorPagina
          mensaje={errorCarga?.message ?? 'Campaña no encontrada'}
          volverA="/campanas"
          textoVolver="← Volver a las campañas"
        />
      );
    }
    if (inicial.usuarioId !== usuario?.id) {
      return (
        <ErrorPagina
          mensaje="Solo el master puede editar la campaña"
          volverA="/campanas"
          textoVolver="← Volver a las campañas"
        />
      );
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    setGuardando(true);
    try {
      const datos: CampanaInput = {
        nombre: String(fd.get('nombre') || '').trim(),
        descripcion: String(fd.get('descripcion') || '').trim(),
        imagenUrl: imagenUrl || null,
      };

      const campana = esEdicion
        ? await campanaService.actualizar(campanaId!, datos)
        : await campanaService.crear(datos);

      navigate(`/campanas/${campana.id}`);
    } catch (err) {
      setError(mensajeError(err));
      setGuardando(false);
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">{esEdicion ? 'Editar campaña' : 'Nueva campaña'}</h2>

      {error && <ErrorAlert mensaje={error} />}

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            name="nombre"
            type="text"
            className="form-control"
            maxLength={100}
            defaultValue={inicial?.nombre}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="control-textarea form-control"
            rows={4}
            maxLength={500}
            defaultValue={inicial?.descripcion ?? ''}
          />
        </div>

        <ImageUpload
          tipo="campanas"
          valorInicial={inicial?.imagenUrl}
          onChange={setImagenUrl}
          etiqueta="Imagen de portada"
          forma="rectangulo"
        />

        <div className="d-flex gap-2 mt-2">
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
