import { useMemo } from 'react';
import { resolveAssetUrl } from '../services/api';

interface AvatarProps {
  url?: string | null;
  nombre?: string;
  alt?: string;
  tamanio?: number;
  forma?: 'circulo' | 'cuadrado';
  className?: string;
}

const COLORES = [
  '#0d6efd',
  '#6610f2',
  '#6f42c1',
  '#d63384',
  '#dc3545',
  '#fd7e14',
  '#198754',
  '#20c997',
  '#0dcaf0',
];

// El color sale del nombre, así la misma persona se ve igual en todas las pantallas
function colorPorNombre(nombre: string) {
  let hash = 0;

  for (const caracter of nombre) {
    hash = (hash * 31 + caracter.charCodeAt(0)) >>> 0;
  }

  return COLORES[hash % COLORES.length];
}

export function Avatar({
  url,
  nombre,
  alt = '',
  tamanio = 40,
  forma = 'circulo',
  className = '',
}: AvatarProps) {
  const src = resolveAssetUrl(url);

  const claseForma = forma === 'circulo' ? 'rounded-circle' : 'rounded';

  if (src) {
    return (
      <img
        src={src}
        alt={alt || nombre || ''}
        className={`${claseForma} ${className}`}
        style={{
          width: `${tamanio}px`,
          height: `${tamanio}px`,
          objectFit: 'cover',
        }}
      />
    );
  }

  // Si no hay imagen ni nombre, muestra el ícono genérico
  if (!nombre) {
    return (
      <i
        className={`bi bi-person-circle text-body-secondary ${className}`}
        style={{ fontSize: `${tamanio}px`, lineHeight: 1 }}
      />
    );
  }

  const bg = colorPorNombre(nombre);

  return (
    <div
      className={`d-inline-flex align-items-center justify-content-center text-white fw-bold user-select-none ${claseForma} ${className}`}
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