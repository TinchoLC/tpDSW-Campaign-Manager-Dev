import { useCallback, useRef, useState, type ReactNode } from 'react';

interface OpcionesConfirmar {
  titulo?: string;
  mensaje: string;
  textoConfirmar?: string;
  peligro?: boolean; // botón rojo para acciones destructivas
}

// Reemplazo de window.confirm con un modal de Bootstrap propio.
// Uso:
//   const { confirmar, dialogo } = useConfirmar();
//   if (!(await confirmar('¿Seguro?'))) return;
//   ...y renderizar {dialogo} dentro del JSX de la pantalla.
export function useConfirmar() {
  const [opciones, setOpciones] = useState<OpcionesConfirmar | null>(null);
  const resolver = useRef<((valor: boolean) => void) | null>(null);

  const confirmar = useCallback(
    (entrada: OpcionesConfirmar | string) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOpciones(typeof entrada === 'string' ? { mensaje: entrada } : entrada);
      }),
    []
  );

  const cerrar = (resultado: boolean) => {
    resolver.current?.(resultado);
    resolver.current = null;
    setOpciones(null);
  };

  const dialogo: ReactNode = opciones && (
    <>
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" onClick={() => cerrar(false)}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{opciones.titulo ?? 'Confirmar acción'}</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => cerrar(false)} />
            </div>
            <div className="modal-body">
              <p className="mb-0">{opciones.mensaje}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={() => cerrar(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className={`btn ${opciones.peligro === false ? 'btn-primary' : 'btn-danger'}`}
                onClick={() => cerrar(true)}
                autoFocus
              >
                {opciones.textoConfirmar ?? 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );

  return { confirmar, dialogo };
}