import { useMemo } from 'react';
import { resolveAssetUrl } from '../services/api';

interface AvatarProps {
  url?: string | null;
  nombre: string;
  alt?: string;
  tamanio?: number; // en píxeles
  forma?: 'circulo' | 'cuadrado';
  className?: string;
}

const COLORES = [
  '#0d6efd', // azul
  '#6610f2', // índigo
  '#6f42c1', // violeta
  '#d63384', // rosa
  '#dc3545', // rojo
  '#fd7e14', // naranja
  '#198754', // verde
  '#20c997', // verde azulado
  '#0dcaf0', // cian
];

export function Avatar({
  url,
  nombre,
  alt = '',
  tamanio = 40,
  forma = 'circulo',
  className = '',
}: AvatarProps) {
  const src = resolveAssetUrl(url);

  // Elegir un color aleatorio entre los disponibles para este render
  const bg = useMemo(() => COLORES[Math.floor(Math.random() * COLORES.length)], []);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || nombre}
        className={`${forma === 'circulo' ? 'rounded-circle' : 'rounded'} ${className}`}
        style={{
          width: `${tamanio}px`,
          height: `${tamanio}px`,
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      className={`d-inline-flex align-items-center justify-content-center text-white fw-bold user-select-none ${
        forma === 'circulo' ? 'rounded-circle' : 'rounded'
      } ${className}`}
      style={{
        width: `${tamanio}px`,
        height: `${tamanio}px`,
        backgroundColor: bg,
        fontSize: `${Math.round(tamanio * 0.45)}px`,
        lineHeight: 1,
      }}
      title={nombre}
    >
      {nombre.charAt(0).toUpperCase()}
    </div>
  );
}
