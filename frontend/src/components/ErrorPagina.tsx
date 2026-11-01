import { Link, useNavigate } from 'react-router-dom';

interface ErrorPaginaProps {
  mensaje: string;
  volverA?: string; // si no se pasa, el botón vuelve a la página anterior
  textoVolver?: string;
}

// Pantalla completa de error con un link para volver
export function ErrorPagina({ mensaje, volverA, textoVolver = 'Volver' }: ErrorPaginaProps) {
  const navigate = useNavigate();

  return (
    <main className="container py-4">
      <div className="alert alert-danger">{mensaje}</div>
      {volverA ? (
        <Link to={volverA}>{textoVolver}</Link>
      ) : (
        <button type="button" className="btn btn-link p-0" onClick={() => navigate(-1)}>
          {textoVolver}
        </button>
      )}
    </main>
  );
}
