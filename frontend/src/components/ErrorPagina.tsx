import { Link } from 'react-router-dom';

interface ErrorPaginaProps {
  mensaje: string;
  volverA: string;
  textoVolver: string;
}

// Pantalla completa de error con un link para volver
export function ErrorPagina({ mensaje, volverA, textoVolver }: ErrorPaginaProps) {
  return (
    <main className="container py-4">
      <div className="alert alert-danger">{mensaje}</div>
      <Link to={volverA}>{textoVolver}</Link>
    </main>
  );
}
