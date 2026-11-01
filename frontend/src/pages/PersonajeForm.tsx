import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { ErrorAlert } from '../components/ErrorAlert';
import { ErrorPagina } from '../components/ErrorPagina';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import {
  personajeService,
  type EstadoAgresion,
  type Personaje,
  type PersonajeDetalle,
  type PersonajeInput,
  type TipoPersonaje,
} from '../services/personaje.service';
import { mensajeError, num, txt } from '../utils/form';

const ESTADISTICAS = [
  ['fuerza', 'Fuerza'],
  ['destreza', 'Destreza'],
  ['constitucion', 'Constitución'],
  ['inteligencia', 'Inteligencia'],
  ['sabiduria', 'Sabiduría'],
  ['carisma', 'Carisma'],
] as const;

interface FormularioProps {
  tipo: TipoPersonaje;
  campanaId?: number; // solo al crear un NPC
  inicial?: Personaje; // si viene, se edita
}

function Formulario({ tipo, campanaId, inicial }: FormularioProps) {
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [imagenUrl, setImagenUrl] = useState<string | null>(inicial?.imagenUrl ?? null);
  const navigate = useNavigate();

  const esEdicion = inicial !== undefined;
  const esJugable = tipo === 'jugable';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);

    // Al editar, un texto vacío se envía como '' para poder borrarlo.
    // Los números vacíos se omiten: quedan como estaban.
    const texto = (campo: string) =>
      esEdicion ? String(fd.get(campo) ?? '').trim() : txt(fd, campo);

    const datos: PersonajeInput = {
      nombre: String(fd.get('nombre') || '').trim(),
      descripcion: texto('descripcion'),
      especie: texto('especie'),
      armadura: texto('armadura'),
      iniciativa: num(fd, 'iniciativa'),
      velocidad: num(fd, 'velocidad'),
      vidaMax: num(fd, 'vidaMax'),
      fuerza: num(fd, 'fuerza'),
      destreza: num(fd, 'destreza'),
      constitucion: num(fd, 'constitucion'),
      inteligencia: num(fd, 'inteligencia'),
      carisma: num(fd, 'carisma'),
      sabiduria: num(fd, 'sabiduria'),
    };

    if (imagenUrl) {
      datos.imagenUrl = imagenUrl;
    } else if (esEdicion) {
      datos.imagenUrl = null;
    }

    if (esJugable) {
      datos.clase = texto('clase');
      datos.nivel = num(fd, 'nivel');
      datos.manaMax = num(fd, 'manaMax');
      datos.experiencia = num(fd, 'experiencia');
      datos.oro = num(fd, 'oro');
    } else {
      datos.estadoAgresion = txt(fd, 'estadoAgresion') as EstadoAgresion | undefined;
    }

    // El tipo y la campaña solo se definen al crear
    if (!esEdicion) {
      datos.tipo = tipo;
      if (!esJugable) datos.campanaId = campanaId;
    }

    setGuardando(true);
    try {
      const personaje = esEdicion
        ? await personajeService.actualizar(inicial.id, datos)
        : await personajeService.crear(datos);

      navigate(!esEdicion && !esJugable ? `/campanas/${campanaId}` : `/personajes/${personaje.id}`);
    } catch (err) {
      setError(mensajeError(err));
      setGuardando(false);
    }
  };

  const titulo = `${esEdicion ? 'Editar' : 'Nuevo'} ${esJugable ? 'personaje' : 'NPC'}`;

  return (
    <main className="container py-4" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">{titulo}</h2>

      {error && <ErrorAlert mensaje={error} />}

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="row g-3">
          <div className="col-12">
            <ImageUpload
              tipo="personajes"
              valorInicial={inicial?.imagenUrl}
              onChange={setImagenUrl}
              etiqueta={`Imagen del ${esJugable ? 'personaje' : 'NPC'} (opcional)`}
              forma="circulo"
            />
          </div>

          <div className="col-md-6">
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
          <div className="col-md-6">
            <label className="form-label">Especie</label>
            <input
              name="especie"
              type="text"
              className="form-control"
              defaultValue={inicial?.especie ?? ''}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              className="form-control"
              rows={2}
              defaultValue={inicial?.descripcion ?? ''}
            />
          </div>

          {esJugable ? (
            <>
              <div className="col-md-6">
                <label className="form-label">Clase</label>
                <input
                  name="clase"
                  type="text"
                  className="form-control"
                  defaultValue={inicial?.clase ?? ''}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nivel</label>
                <input
                  name="nivel"
                  type="number"
                  className="form-control"
                  min={1}
                  defaultValue={inicial?.nivel ?? 1}
                />
              </div>
            </>
          ) : (
            <div className="col-md-6">
              <label className="form-label">Actitud</label>
              <select
                name="estadoAgresion"
                className="form-select"
                defaultValue={inicial?.estadoAgresion ?? ''}
              >
                <option value="">Sin definir</option>
                <option value="hostil">Hostil</option>
                <option value="neutral">Neutral</option>
                <option value="amistoso">Amistoso</option>
              </select>
            </div>
          )}

          <div className="col-md-3">
            <label className="form-label">Vida máxima</label>
            <input
              name="vidaMax"
              type="number"
              className="form-control"
              min={1}
              defaultValue={inicial?.vidaMax ?? ''}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Armadura</label>
            <input
              name="armadura"
              type="text"
              className="form-control"
              defaultValue={inicial?.armadura ?? ''}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Iniciativa</label>
            <input
              name="iniciativa"
              type="number"
              className="form-control"
              defaultValue={inicial?.iniciativa ?? ''}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Velocidad</label>
            <input
              name="velocidad"
              type="number"
              className="form-control"
              defaultValue={inicial?.velocidad ?? ''}
            />
          </div>

          {esJugable && (
            <>
              <div className="col-md-4">
                <label className="form-label">Maná máximo</label>
                <input
                  name="manaMax"
                  type="number"
                  className="form-control"
                  min={0}
                  defaultValue={inicial?.manaMax ?? ''}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Experiencia</label>
                <input
                  name="experiencia"
                  type="number"
                  className="form-control"
                  min={0}
                  defaultValue={inicial?.experiencia ?? ''}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Oro</label>
                <input
                  name="oro"
                  type="number"
                  className="form-control"
                  min={0}
                  defaultValue={inicial?.oro ?? ''}
                />
              </div>
            </>
          )}

          {ESTADISTICAS.map(([clave, etiqueta]) => (
            <div key={clave} className="col-6 col-md-2">
              <label className="form-label">{etiqueta}</label>
              <input
                name={clave}
                type="number"
                className="form-control"
                min={1}
                defaultValue={inicial?.[clave] ?? ''}
              />
            </div>
          ))}
        </div>

        <div className="d-flex gap-2 mt-4">
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

function EditarPersonaje({ id }: { id: number }) {
  const { usuario } = useAuth();
  const { data: datos, error, loading: cargando } = useApi(`personaje-${id}`, () =>
    personajeService.obtener(id)
  );

  if (cargando) return <Cargando pagina />;
  if (error || !datos) {
    return (
      <ErrorPagina
        mensaje={error?.message ?? 'Personaje no encontrado'}
        volverA="/personajes"
        textoVolver="← Volver a mis personajes"
      />
    );
  }

  const p: PersonajeDetalle = datos;
  const puedeEditar =
    p.tipo === 'jugable' ? p.usuarioId === usuario?.id : p.campana?.usuarioId === usuario?.id;

  if (!puedeEditar) {
    return (
      <ErrorPagina
        mensaje="No tenés permiso para editar este personaje"
        volverA="/personajes"
        textoVolver="← Volver a mis personajes"
      />
    );
  }

  return <Formulario tipo={p.tipo} inicial={p} />;
}

// /personajes/nuevo crea un jugable; /campanas/:campanaId/npcs/nuevo crea un NPC;
// /personajes/:id/editar edita cualquiera de los dos
export function PersonajeForm() {
  const { id, campanaId } = useParams();

  if (id) return <EditarPersonaje id={Number(id)} />;
  if (campanaId) return <Formulario tipo="no_jugable" campanaId={Number(campanaId)} />;
  return <Formulario tipo="jugable" />;
}
