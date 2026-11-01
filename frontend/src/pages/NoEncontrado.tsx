import { ErrorPagina } from '../components/ErrorPagina';

export function NoEncontrado() {
  return (
    <ErrorPagina
      mensaje="La página no existe o no tenés permiso para entrar."
      volverA="/campanas"
      textoVolver="← Volver a las campañas"
    />
  );
}