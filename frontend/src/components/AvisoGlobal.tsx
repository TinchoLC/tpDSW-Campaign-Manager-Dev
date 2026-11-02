import { useNotice } from '../hooks/useNotice';

export function AvisoGlobal() {
  const { aviso, cerrar } = useNotice();
  if (!aviso) return null;

  const esError = aviso.tipo === 'error';

  return (
    <div className="container pt-3">
      <div
        className={`alert ${esError ? 'alert-danger' : 'alert-success'} alert-dismissible mb-0`}
        role={esError ? 'alert' : 'status'}
      >
        {aviso.mensaje}
        <button type="button" className="btn-close" aria-label="Cerrar" onClick={cerrar} />
      </div>
    </div>
  );
}