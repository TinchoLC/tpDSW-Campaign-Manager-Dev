import { CircleIcon } from '../components/CircleIcon';
import { ErrorPagina } from '../components/ErrorPagina';

export function NotFound() {
  return (
    <div className="text-center pt-5">
      <CircleIcon diametro={96} />
      <ErrorPagina mensaje="La página que buscás no existe" />
    </div>
  );
}
