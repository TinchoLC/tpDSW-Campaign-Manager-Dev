import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cargando } from '../components/Cargando';
import { FiltroEstado } from '../components/FiltroEstado';
import { TarjetaCampana } from '../components/TarjetaCampana';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { campanaService, type FiltroEstadoCampana } from '../services/campana.service';

export function Campanas() {
  const { usuario } = useAuth();

  // Por defecto mostramos solo las campañas activas
  const [filtro, setFiltro] = useState<FiltroEstadoCampana>('activa');

  const { data: campanas, error, loading } = useApi(`campanas-${filtro}`, () =>
    campanaService.listar(filtro === 'todas' ? undefined : filtro)
  );

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0">Campañas</h2>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <FiltroEstado valor={filtro} onChange={setFiltro} />
          <Link to="/campanas/nueva" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1" />
            Nueva campaña
          </Link>
        </div>
      </div>

      {loading && <Cargando />}

      {error && <div className="alert alert-danger">{error.message}</div>}

      {campanas && campanas.length === 0 && (
        <p className="text-center text-body-secondary py-5">
          No hay campañas {filtro === 'todas' ? '' : `en estado "${filtro}"`}.
        </p>
      )}

      {campanas && campanas.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {campanas.map((campana) => (
            <TarjetaCampana key={campana.id} campana={campana} esMaster={campana.master.id === usuario?.id} />
          ))}
        </div>
      )}
    </main>
  );
}
