import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { ErrorPagina } from '../components/ErrorPagina';
import { ImageUpload } from '../components/ImageUpload';
import { VistaPreviaMapa } from '../components/VistaPreviaMapa';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { resolveAssetUrl } from '../services/api';
import { campanaService, type Campana } from '../services/campana.service';
import { mapaService, type Mapa } from '../services/mapa.service';

const DIMENSION_MIN = 1;
const DIMENSION_MAX = 100;

// "12" -> 12; vacío, decimales o fuera de 1..100 -> null
function aDimension(texto: string): number | null {
  if (texto.trim() === '') return null;
  const numero = Number(texto);
  if (!Number.isInteger(numero) || numero < DIMENSION_MIN || numero > DIMENSION_MAX) return null;
  return numero;
}

function FormularioMapa({ campana, inicial }: { campana: Campana; inicial?: Mapa }) {
  const navigate = useNavigate();
  const esEdicion = Boolean(inicial);
  const volverA = esEdicion ? `/campanas/${campana.id}` : `/campanas/${campana.id}/sesion`;

  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');
  const [columnas, setColumnas] = useState(String(inicial?.columnas ?? 10));
  const [filas, setFilas] = useState(String(inicial?.filas ?? 10));
  // URL relativa de la imagen ya subida (ImageUpload la sube apenas se elige el archivo)
  const [imagenUrl, setImagenUrl] = useState<string | null>(inicial?.imagenUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const nombreLimpio = nombre.trim();
    const cols = aDimension(columnas);
    const fils = aDimension(filas);

    if (!nombreLimpio) return setError('El nombre es obligatorio.');
    if (!imagenUrl) return setError('La imagen del mapa es obligatoria.');
    if (cols === null || fils === null) {
      return setError(`Las columnas y las filas deben ser números enteros entre ${DIMENSION_MIN} y ${DIMENSION_MAX}.`);
    }

    setEnviando(true);
    try {
      const datos = {
        nombre: nombreLimpio,
        descripcion: descripcion.trim() || undefined,
        imagenUrl,
        columnas: cols,
        filas: fils,
      };

      if (inicial) {
        await mapaService.actualizar(inicial.id, datos);
      } else {
        await mapaService.crear(campana.id, datos);
      }

      navigate(volverA);
    } catch (err) {
      // Se conserva el formulario tal cual para poder corregir o reintentar
      setError(err instanceof Error ? err.message : 'No se pudo guardar el mapa.');
      setEnviando(false);
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: '900px' }}>
      <Link to={volverA} className="d-inline-block mb-3">
        {esEdicion ? '← Volver a la campaña' : '← Volver a la sesión'}
      </Link>

      <h2 className="mb-1">{esEdicion ? 'Editar mapa' : 'Nuevo mapa'}</h2>
      <p className="text-body-secondary">Campaña: {campana.nombre}</p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={enviando} className="row g-4 border-0 p-0">
          <div className="col-lg-5">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción (opcional)
              </label>
              <textarea
                id="descripcion"
                className="form-control"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={500}
              />
              <div className="form-text">{descripcion.length}/500</div>
            </div>

            <ImageUpload
              tipo="mapas"
              etiqueta="Imagen del mapa"
              valorInicial={inicial?.imagenUrl}
              onChange={setImagenUrl}
            />

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label htmlFor="columnas" className="form-label">
                  Columnas
                </label>
                <input
                  id="columnas"
                  type="number"
                  className="form-control"
                  min={DIMENSION_MIN}
                  max={DIMENSION_MAX}
                  step={1}
                  value={columnas}
                  onChange={(e) => setColumnas(e.target.value)}
                  required
                />
              </div>
              <div className="col-6">
                <label htmlFor="filas" className="form-label">
                  Filas
                </label>
                <input
                  id="filas"
                  type="number"
                  className="form-control"
                  min={DIMENSION_MIN}
                  max={DIMENSION_MAX}
                  step={1}
                  value={filas}
                  onChange={(e) => setFilas(e.target.value)}
                  required
                />
              </div>
              <div className="form-text mt-0">Entre {DIMENSION_MIN} y {DIMENSION_MAX} celdas.</div>
            </div>
          </div>

          <div className="col-lg-7">
            <p className="form-label">Vista previa</p>
            <VistaPreviaMapa
              imagenSrc={resolveAssetUrl(imagenUrl)}
              columnas={aDimension(columnas)}
              filas={aDimension(filas)}
            />
          </div>

          <div className="col-12 d-flex gap-2 justify-content-end">
            <Link
              to={volverA}
              className={`btn btn-outline-secondary ${enviando ? 'disabled' : ''}`}
              aria-disabled={enviando}
            >
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary">
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  );
}

// Solo el master de la campaña puede crear o editar mapas, y no si la campaña está finalizada
export function MapEditor() {
  const { id, mapaId } = useParams();
  const campanaId = Number(id);
  const { usuario } = useAuth();

  const { data: campana, error, loading } = useApi(`campana-${campanaId}`, () =>
    campanaService.obtener(campanaId)
  );
  const { data: mapaExistente, error: errorMapa, loading: cargandoMapa } = useApi(
    mapaId ? `mapa-editar-${mapaId}` : 'mapa-nuevo',
    () => (mapaId ? mapaService.conFichas(Number(mapaId)) : Promise.resolve(null))
  );

  if (loading || cargandoMapa) return <Cargando pagina />;

  if (error || !campana || errorMapa) {
    return (
      <ErrorPagina
        mensaje={error?.message ?? errorMapa?.message ?? 'No se pudo cargar la campaña'}
        volverA="/campanas"
        textoVolver="← Volver a las campañas"
      />
    );
  }

  if (campana.master.id !== usuario?.id) {
    return (
      <ErrorPagina
        mensaje="Acceso denegado: solo el master de la campaña puede gestionar mapas."
        volverA={`/campanas/${campana.id}`}
        textoVolver="← Volver a la campaña"
      />
    );
  }

  if (campana.estado === 'finalizada') {
    return (
      <ErrorPagina
        mensaje="La campaña está finalizada: ya no se pueden modificar mapas."
        volverA={`/campanas/${campana.id}`}
        textoVolver="← Volver a la campaña"
      />
    );
  }

  return <FormularioMapa campana={campana} inicial={mapaExistente ?? undefined} />;
}
