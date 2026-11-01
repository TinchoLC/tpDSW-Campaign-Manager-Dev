import { useState } from 'react';
import { resolveAssetUrl } from '../services/api';
import type { Ficha, MapaConFichas } from '../services/mapa.service';
import type { Personaje } from '../services/personaje.service';
import { colorBordeFicha, colorDeFicha, esFichaDelUsuario, estaCaida, imagenDeFicha, nombreDeFicha } from '../utils/ficha';

interface TokenProps {
  ficha: Ficha;
  columnas: number;
  filas: number;
  celdaAncha: boolean;
  esMia: boolean;
  puedeMover: boolean;
  estaSeleccionada: boolean;
  colorBorde: string;
  onSeleccionar: (id: number) => void;
}

function Token({
  ficha,
  columnas,
  filas,
  celdaAncha,
  puedeMover,
  estaSeleccionada,
  colorBorde,
  onSeleccionar,
}: TokenProps) {
  const nombre = nombreDeFicha(ficha);
  const imagen = imagenDeFicha(ficha);
  const caida = estaCaida(ficha);
  const colorFondo = colorDeFicha(nombre);

  const handleDragStart = (e: React.DragEvent) => {
    if (!puedeMover) return e.preventDefault();
    e.dataTransfer.setData('text/plain', String(ficha.id));
    onSeleccionar(ficha.id);
  };

  return (
    <div
      title={nombre}
      draggable={puedeMover}
      onDragStart={handleDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onSeleccionar(ficha.id);
      }}
      className="d-flex align-items-center justify-content-center"
      style={{
        position: 'absolute',
        left: `${(ficha.posicionX / columnas) * 100}%`,
        top: `${(ficha.posicionY / filas) * 100}%`,
        width: `${100 / columnas}%`,
        height: `${100 / filas}%`,
        cursor: puedeMover ? 'grab' : 'pointer',
        // Animación suave con ease cuando se actualiza la posición o se mueve
        transition: 'left 0.25s ease-out, top 0.25s ease-out',
        zIndex: estaSeleccionada ? 10 : 2,
      }}
    >
      {/* 
        La ficha mantiene proporción 1:1 (cuadrada / circular perfecta) siempre centrada:
        toma el 82% del lado más chico de la celda (alto si la celda es más ancha que alta,
        o ancho si la celda es más alta que ancha) para nunca estirarse ni deformarse.
      */}
      <div
        className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center fw-bold shadow-sm"
        style={{
          width: celdaAncha ? 'auto' : '82%',
          height: celdaAncha ? '82%' : 'auto',
          aspectRatio: '1 / 1',
          opacity: caida ? 0.5 : 1,
          backgroundColor: imagen ? '#2b2f33' : colorFondo,
          color: '#ffffff',
          border: `3px solid ${colorBorde}`,
          boxShadow: estaSeleccionada ? '0 0 0 3px #0d6efd, 0 4px 8px rgba(0,0,0,0.5)' : undefined,
          flexShrink: 0,
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
  npcs: Personaje[];
  usuarioId: number;
  esMaster: boolean;
  campanaFinalizada: boolean;
  fichaSeleccionadaId: number | null;
  onSeleccionarFicha: (id: number | null) => void;
  onMoverFicha: (fichaId: number, x: number, y: number) => void;
}

export function TableroMapa({
  mapa,
  npcs,
  usuarioId,
  esMaster,
  campanaFinalizada,
  fichaSeleccionadaId,
  onSeleccionarFicha,
  onMoverFicha,
}: TableroMapaProps) {
  const imagenMapa = resolveAssetUrl(mapa.imagenUrl);
  const [ratioImagen, setRatioImagen] = useState<number>(1);

  const lineas = 'rgba(255, 255, 255, 0.35)';

  // Relación ancho/alto de cada celda individual según las proporciones reales del mapa
  const ratioCelda = ratioImagen * (mapa.filas / mapa.columnas);
  const celdaAncha = ratioCelda >= 1;

  const puedeMoverFicha = (ficha: Ficha) => {
    if (campanaFinalizada || estaCaida(ficha)) return false;
    return esMaster || esFichaDelUsuario(ficha, usuarioId);
  };

  const handleDrop = (e: React.DragEvent, x: number, y: number) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData('text/plain'));
    const ficha = mapa.fichas.find((f) => f.id === id);
    if (ficha && puedeMoverFicha(ficha)) {
      onMoverFicha(id, x, y);
    }
  };

  const handleClickCelda = (x: number, y: number) => {
    if (fichaSeleccionadaId !== null) {
      const ficha = mapa.fichas.find((f) => f.id === fichaSeleccionadaId);
      if (ficha && puedeMoverFicha(ficha)) {
        onMoverFicha(fichaSeleccionadaId, x, y);
        return;
      }
    }
    onSeleccionarFicha(null);
  };

  return (
    <div className="border rounded overflow-hidden bg-dark shadow-sm">
      <div
        className="position-relative"
        style={!imagenMapa ? { aspectRatio: `${mapa.columnas} / ${mapa.filas}`, backgroundColor: '#2b2f33' } : undefined}
        onClick={() => onSeleccionarFicha(null)}
      >
        {/* Imagen del mapa renderizada naturalmente (sin forzar celdas cuadradas ni barras negras) */}
        {imagenMapa && (
          <img
            src={imagenMapa}
            alt={mapa.nombre}
            className="w-100 d-block"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (naturalWidth && naturalHeight) {
                setRatioImagen(naturalWidth / naturalHeight);
              }
            }}
          />
        )}

        {/* Líneas de la grilla según las columnas y filas configuradas */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: [
              `linear-gradient(to right, ${lineas} 1px, transparent 1px)`,
              `linear-gradient(to bottom, ${lineas} 1px, transparent 1px)`,
            ].join(', '),
            backgroundSize: `${100 / mapa.columnas}% ${100 / mapa.filas}%`,
            boxShadow: `inset 0 0 0 1px ${lineas}`,
          }}
        />

        {/* Celdas interactivas para drop y click */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${mapa.columnas}, 1fr)`,
            gridTemplateRows: `repeat(${mapa.filas}, 1fr)`,
          }}
        >
          {Array.from({ length: mapa.filas * mapa.columnas }, (_, i) => {
            const x = i % mapa.columnas;
            const y = Math.floor(i / mapa.columnas);
            return (
              <div
                key={`${x}-${y}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, x, y)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickCelda(x, y);
                }}
              />
            );
          })}
        </div>

        {/* Fichas sobre la grilla */}
        {mapa.fichas.map((f) => (
          <Token
            key={f.id}
            ficha={f}
            columnas={mapa.columnas}
            filas={mapa.filas}
            celdaAncha={celdaAncha}
            esMia={esFichaDelUsuario(f, usuarioId)}
            puedeMover={puedeMoverFicha(f)}
            estaSeleccionada={fichaSeleccionadaId === f.id}
            colorBorde={colorBordeFicha(f, usuarioId, npcs)}
            onSeleccionar={onSeleccionarFicha}
          />
        ))}
      </div>
    </div>
  );
}
