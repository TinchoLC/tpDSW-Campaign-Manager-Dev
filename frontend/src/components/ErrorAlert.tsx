// Aviso de error dentro de una pantalla (para una pantalla entera en error, ver ErrorPagina)
export function ErrorAlert({ mensaje }: { mensaje: string }) {
  return (
    <div className="alert alert-danger" role="alert">
      {mensaje}
    </div>
  );
}
