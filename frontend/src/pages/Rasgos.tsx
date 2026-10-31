import { RasgosPanel } from '../components/RasgosPanel';

export function Rasgos() {
  return (
    <main className="container py-4">
      <h2 className="mb-3">Rasgos generales</h2>
      <p className="text-body-secondary">
        Los rasgos generales están disponibles en todas las campañas. Los rasgos propios de una
        campaña los administra su master desde la pantalla de la campaña.
      </p>
      <RasgosPanel titulo="Listado" />
    </main>
  );
}
