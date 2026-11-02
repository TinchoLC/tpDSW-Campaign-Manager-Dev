
import { useEffect, useState } from 'react';
import {
  campanaService,
  type Participante,
  type ParticipanteUpdate,
} from '../services/campana.service';

interface Props {
  campanaId: number;
  participante: Participante;
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

  useEffect(() => {
    setValor(String(value ?? ''));
  }, [value]);

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
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
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

export function DetalleParticipante({
  campanaId,
  participante,
  editable,
  onActualizado,
}: Props) {
  const [errorEstado, setErrorEstado] = useState<string | null>(null);

  const actualizar = async (datos: ParticipanteUpdate) => {
    await campanaService.actualizarParticipante(
      campanaId,
      participante.id,
      datos
    );
    onActualizado();
  };

  const campo = (
    label: string,
    propiedad: keyof ParticipanteUpdate,
    min?: number,
    tipo: 'text' | 'number' = 'number'
  ) => (
    <CampoEditable
      label={label}
      value={participante[propiedad] as string | number | null}
      editable={editable}
      tipo={tipo}
      min={min}
      nullable={propiedad !== 'nombre'}
      onGuardar={(value) =>
        actualizar({ [propiedad]: value } as ParticipanteUpdate)
      }
    />
  );

  const cambiarEstado = async (estado: Participante['estado']) => {
    try {
      setErrorEstado(null);
      await actualizar({ estado });
    } catch (err) {
      setErrorEstado(
        err instanceof Error ? err.message : 'No se pudo actualizar el estado'
      );
    }
  };

  return (
    <div>
      {!editable && (
        <div className="alert alert-secondary py-2 small">
          Solo podés visualizar los datos de este personaje.
        </div>
      )}

      <h6 className="fw-bold small text-body-secondary mb-2">
        Información del personaje
      </h6>

      <div className="mb-3">
        {campo('Nombre', 'nombre', undefined, 'text')}
        <div className="mt-2">
          {campo('Clase', 'clase', undefined, 'text')}
        </div>
        <div className="mt-2">
          {campo('Nivel', 'nivel', 1)}
        </div>
      </div>

      <h6 className="fw-bold small text-body-secondary mb-1">
        Combate y recursos
      </h6>

      <div className="row g-1 text-center small mb-3">
        {campo('Vida actual', 'vidaActual', 0)}
        {campo('Vida máxima', 'vidaMax', 1)}
        {campo('Armadura', 'armadura', undefined, 'text')}
        {campo('Iniciativa', 'iniciativa')}
        {campo('Velocidad', 'velocidad', 0)}
        {campo('Maná actual', 'manaActual', 0)}
        {campo('Maná máximo', 'manaMax', 0)}
        {campo('Oro', 'oro', 0)}
        {campo('Experiencia', 'experiencia', 0)}
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
        Estado
      </h6>

      <select
        className="form-select form-select-sm mb-2"
        value={participante.estado}
        disabled={!editable}
        onChange={(e) =>
          cambiarEstado(e.target.value as Participante['estado'])
        }
      >
        <option value="vivo">Vivo</option>
        <option value="inconsciente">Inconsciente</option>
        <option value="muerto">Muerto</option>
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
