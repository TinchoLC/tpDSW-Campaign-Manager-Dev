import type { Ficha } from '../../../frontend-campanas/frontend/src/services/mapa.service';
import { esFichaDelUsuario, esNpc, nombreDeFicha } from '../utils/ficha';

interface ListaFichasProps {
  fichas: Ficha[];
  usuarioId: number;
}

// Listado de las fichas del mapa con su tipo, estado y posición
export function ListaFichas({ fichas, usuarioId }: ListaFichasProps) {
  if (fichas.length === 0) {
    return <p className="text-body-secondary">Todavía no hay fichas colocadas.</p>;
  }

  return (
    <ul className="list-group">
      {fichas.map((ficha) => {
        const estado = ficha.personajeCampana?.estado;
        const tipo = esNpc(ficha) ? 'NPC' : esFichaDelUsuario(ficha, usuarioId) ? 'Tu personaje' : 'Jugador';

        return (
          <li key={ficha.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">{nombreDeFicha(ficha)}</div>
              <small className="text-body-secondary">
                {tipo}
                {estado && estado !== 'vivo' ? ` · ${estado}` : ''}
              </small>
            </div>
            <small className="text-body-secondary">
              col {ficha.posicionX + 1}, fila {ficha.posicionY + 1}
            </small>
          </li>
        );
      })}
    </ul>
  );
}
