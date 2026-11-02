
import { useState } from 'react';
import {
  personajeService,
  type Personaje,
  type PersonajeInput,
  type EstadoAgresion,
} from '../services/personaje.service';
import { ImageUpload } from './ImageUpload';

interface Props {
  npc: Personaje;
  editable: boolean;
  onActualizado: () => void;
}

interface CampoEditableProps {
  label: string;
  value: string | number | null;
  editable: boolean;
  tipo?: 'text' | 'number';
  min?: number;
  nullable?: boolean;
  onGuardar: (value: string | number | null) => Promise<void>;
}

function CampoEditable({
  label,
  value,
  editable,
  tipo = 'number',
  min,
  nullable = true,
  onGuardar,
}: CampoEditableProps) {
  const [valor, setValor] = useState(String(value ?? ''));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);

  const guardar = async () => {
    const original = String(value ?? '');

    if (valor === original) return;

    if (valor.trim() === '') {
      if (!nullable) {
        setValor(original);
        return;
      }

      try {
        setGuardando(true);
        setError(false);
        await onGuardar(null);
      } catch {
        setError(true);
        setValor(original);
      } finally {
        setGuardando(false);
      }
      return;
    }

    let nuevoValor: string | number = valor;

    if (tipo === 'number') {
      const numero = Number(valor);

      if (!Number.isInteger(numero) || (min !== undefined && numero < min)) {
        setValor(original);
        setError(true);
        return;
      }

      nuevoValor = numero;
    }

    try {
      setGuardando(true);
      setError(false);
      await onGuardar(nuevoValor);
    } catch {
      setError(true);
      setValor(original);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="col-4">
      <div className="bg-body-tertiary p-1 rounded border h-100">
        <small className="text-body-secondary d-block">{label}</small>

        <input
          type={tipo}
          min={min}
          className={`form-control form-control-sm text-center fw-bold border-0 bg-transparent ${
            error ? 'text-danger' : ''
          }`}
          value={valor}
          disabled={!editable || guardando}
          onChange={(e) => {
            setValor(e.target.value);
            setError(false);
          }}
          onBlur={guardar}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();

            if (e.key === 'Escape') {
              setValor(String(value ?? ''));
              e.currentTarget.blur();
            }
          }}
          aria-label={label}
        />

        {guardando && (
          <small className="text-primary d-block">Guardando...</small>
        )}

        {error && (
          <small className="text-danger d-block">Error al guardar</small>
        )}
      </div>
    </div>
  );
}

export function DetalleNpc({ npc, editable, onActualizado }: Props) {
  const [errorEstado, setErrorEstado] = useState<string | null>(null);
  const [errorDescripcion, setErrorDescripcion] = useState(false);
  const [descripcion, setDescripcion] = useState(npc.descripcion ?? '');

  const actualizar = async (datos: PersonajeInput) => {
    await personajeService.actualizar(npc.id, datos);
    onActualizado();
  };

  const campo = (
    label: string,
    propiedad: keyof PersonajeInput,
    min?: number,
    tipo: 'text' | 'number' = 'number'
  ) => (
    <CampoEditable
      key={`${npc.id}-${propiedad}-${String(npc[propiedad as keyof Personaje] ?? '')}`}
      label={label}
      value={npc[propiedad as keyof Personaje] as string | number | null}
      editable={editable}
      tipo={tipo}
      min={min}
      nullable={propiedad !== 'nombre'}
      onGuardar={(value) =>
        actualizar({ [propiedad]: value } as PersonajeInput)
      }
    />
  );

  const guardarDescripcion = async () => {
    if (descripcion === (npc.descripcion ?? '')) return;

    try {
      setErrorDescripcion(false);
      await actualizar({ descripcion });
    } catch {
      setDescripcion(npc.descripcion ?? '');
      setErrorDescripcion(true);
    }
  };

  const cambiarEstado = async (estado: EstadoAgresion) => {
    try {
      setErrorEstado(null);
      await actualizar({ estadoAgresion: estado });
    } catch (err) {
      setErrorEstado(
        err instanceof Error ? err.message : 'No se pudo actualizar el comportamiento'
      );
    }
  };

  const cambiarImagen = async (imagenUrl: string | null) => {
    try {
      await actualizar({ imagenUrl });
    } catch {
      setErrorEstado('No se pudo actualizar la imagen');
    }
  };

  return (
    <div>
      {!editable && (
        <div className="alert alert-secondary py-2 small">
          Solo podés visualizar los datos de este NPC.
        </div>
      )}

      <h6 className="fw-bold small text-body-secondary mb-2">
        Información del NPC
      </h6>

      <div className="mb-3">
        {campo('Nombre', 'nombre', undefined, 'text')}

        <div className="mt-2">
          {campo('Especie', 'especie', undefined, 'text')}
        </div>

        <div className="mt-3">
          <label className="form-label small text-body-secondary">
            Descripción
          </label>
          <textarea
            className={`form-control form-control-sm ${errorDescripcion ? 'is-invalid' : ''}`}
            rows={3}
            value={descripcion}
            disabled={!editable}
            onChange={(e) => setDescripcion(e.target.value)}
            onBlur={guardarDescripcion}
          />
          {errorDescripcion && (
            <small className="text-danger">Error al guardar la descripción</small>
          )}
        </div>

        <div className="mt-3">
          <ImageUpload
            tipo="personajes"
            valorInicial={npc.imagenUrl}
            onChange={cambiarImagen}
            etiqueta="Imagen del NPC"
            forma="circulo"
          />
        </div>
      </div>

      <h6 className="fw-bold small text-body-secondary mb-1">
        Combate
      </h6>

      <div className="row g-1 text-center small mb-3">
        {campo('Vida actual', 'vidaActual', 0)}
        {campo('Vida máxima', 'vidaMax', 1)}
        {campo('Armadura', 'armadura', undefined, 'text')}
        {campo('Iniciativa', 'iniciativa')}
        {campo('Velocidad', 'velocidad', 0)}
      </div>

      <h6 className="fw-bold small text-body-secondary mb-1">
        Atributos
      </h6>

      <div className="row g-1 text-center small mb-3">
        {campo('Fuerza', 'fuerza', 1)}
        {campo('Destreza', 'destreza', 1)}
        {campo('Constitución', 'constitucion', 1)}
        {campo('Inteligencia', 'inteligencia', 1)}
        {campo('Sabiduría', 'sabiduria', 1)}
        {campo('Carisma', 'carisma', 1)}
      </div>

      <h6 className="fw-bold small text-body-secondary mb-1">
        Comportamiento
      </h6>

      <select
        className="form-select form-select-sm mb-2"
        value={npc.estadoAgresion ?? 'neutral'}
        disabled={!editable}
        onChange={(e) => cambiarEstado(e.target.value as EstadoAgresion)}
      >
        <option value="hostil">Hostil</option>
        <option value="neutral">Neutral</option>
        <option value="amistoso">Amistoso</option>
      </select>

      {errorEstado && (
        <div className="alert alert-danger py-2 small">
          {errorEstado}
        </div>
      )}

      <small className="text-body-secondary">
        Los cambios se guardan automáticamente al salir de cada campo.
      </small>
    </div>
  );
}
