import { useState, type FormEvent } from 'react';
import { campanaService } from '../../../frontend-campanas/frontend/src/services/campana.service';
import type { PersonajeJugable } from '../../../frontend-campanas/frontend/src/services/personaje.service';

interface ModalUnirseProps {
  campanaId: number;
  personajes: PersonajeJugable[];
  onCerrar: () => void;
  onUnido: () => void;
}

// "Nombre · Clase · Nivel 3" (omite lo que el personaje no tenga)
function etiquetaPersonaje(p: PersonajeJugable): string {
  return [p.nombre, p.clase, p.nivel ? `Nivel ${p.nivel}` : null].filter(Boolean).join(' · ');
}

// Modal para elegir con cuál de los personajes jugables del usuario unirse a la campaña
export function ModalUnirse({ campanaId, personajes, onCerrar, onUnido }: ModalUnirseProps) {
  const [personajeId, setPersonajeId] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!personajeId) return;

    setEnviando(true);
    setError(null);
    try {
      await campanaService.unirse(campanaId, Number(personajeId));
      onUnido();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo unir el personaje');
      setEnviando(false);
    }
  };

  return (
    <>
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" onClick={onCerrar}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Elegí tu personaje</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar} />
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <p>
                Se crea una versión de tu personaje para esta campaña. La plantilla original no cambia.
                Si ya participó antes, retoma su progreso.
              </p>

              <label htmlFor="personaje" className="form-label">
                ¿Con cuál de tus personajes querés unirte?
              </label>
              <select
                id="personaje"
                className="form-select"
                value={personajeId}
                onChange={(e) => setPersonajeId(e.target.value)}
                required
              >
                <option value="">Seleccioná un personaje</option>
                {personajes.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.vidaMax == null}>
                    {etiquetaPersonaje(p)}
                    {p.vidaMax == null ? ' — sin vida máxima definida' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={!personajeId || enviando}>
                {enviando ? 'Uniéndose...' : 'Unirse'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}
