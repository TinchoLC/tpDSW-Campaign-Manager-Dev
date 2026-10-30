import { resolveAssetUrl } from '../services/api';
import type { Ficha, MapaConFichas } from '../../../frontend-campanas/frontend/src/services/mapa.service';
import { esFichaDelUsuario, esNpc, estaCaida, imagenDeFicha, nombreDeFicha } from '../utils/ficha';

interface TokenProps {
  ficha: Ficha;
  columnas: number;
  filas: number;
  esMia: boolean;
}

// Ficha dibujada sobre la celda que le corresponde en la grilla
function Token({ ficha, columnas, filas, esMia }: TokenProps) {
  const nombre = nombreDeFicha(ficha);
  const imagen = imagenDeFicha(ficha);
  const caida = estaCaida(ficha);

  const colorBorde = esNpc(ficha) ? 'border-warning' : esMia ? 'border-success' : 'border-info';

  return (
    <div
      title={caida ? `${nombre} (${ficha.personajeCampana?.estado})` : nombre}
      style={{
        position: 'absolute',
        left: `${(ficha.posicionX / columnas) * 100}%`,
        top: `${(ficha.posicionY / filas) * 100}%`,
        width: `${100 / columnas}%`,
        height: `${100 / filas}%`,
        padding: '6%',
      }}
    >
      <div
        className={`w-100 h-100 rounded-circle border border-3 ${colorBorde} bg-body overflow-hidden d-flex align-items-center justify-content-center fw-bold`}
        style={{
          opacity: caida ? 0.5 : 1,
          filter: caida ? 'grayscale(1)' : undefined,
          fontSize: 'clamp(8px, 1.4vw, 18px)',
        }}
      >
        {imagen ? (
          <img src={imagen} alt={nombre} className="w-100 h-100" style={{ objectFit: 'cover' }} />
        ) : (
          nombre.slice(0, 2).toUpperCase()
        )}
      </div>
    </div>
  );
}

interface TableroMapaProps {
  mapa: MapaConFichas;
  usuarioId: number;
}

// Mapa con su imagen de fondo, la grilla y las fichas colocadas
export function TableroMapa({ mapa, usuarioId }: TableroMapaProps) {
  const imagenMapa = resolveAssetUrl(mapa.imagenUrl);
  const lineas = 'rgba(255, 255, 255, 0.35)';

  const fondos = [
    `linear-gradient(to right, ${lineas} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${lineas} 1px, transparent 1px)`,
    ...(imagenMapa ? [`url("${imagenMapa}")`] : []),
  ].join(', ');

  const tamanios = [
    `${100 / mapa.columnas}% ${100 / mapa.filas}%`,
    `${100 / mapa.columnas}% ${100 / mapa.filas}%`,
    'cover',
  ].join(', ');

  return (
    <div
      className="border"
      style={{
        position: 'relative',
        width: '100%',
        // Que el mapa no se pase del alto de la pantalla
        maxWidth: `calc(75vh * ${mapa.columnas} / ${mapa.filas})`,
        aspectRatio: `${mapa.columnas} / ${mapa.filas}`,
        backgroundColor: '#2b2f33',
        backgroundImage: fondos,
        backgroundSize: tamanios,
      }}
    >
      {mapa.fichas.map((ficha) => (
        <Token
          key={ficha.id}
          ficha={ficha}
          columnas={mapa.columnas}
          filas={mapa.filas}
          esMia={esFichaDelUsuario(ficha, usuarioId)}
        />
      ))}
    </div>
  );
}
