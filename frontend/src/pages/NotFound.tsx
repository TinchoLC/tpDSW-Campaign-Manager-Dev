import { ErrorPagina } from '../components/ErrorPagina';

export function NotFound() {
  return (
    <ErrorPagina
      mensaje="La página que buscás no existe"
      volverA="/campanas"
      textoVolver="← Volver a las campañas"
    />
  );
}