import { resolveAssetUrl } from '../services/api';

interface AvatarProps {
  url?: string | null;
  alt?: string;
  tamanio?: number; // en píxeles
}

// Imagen circular de un personaje o usuario; sin imagen muestra un ícono genérico
export function Avatar({ url, alt = '', tamanio = 40 }: AvatarProps) {
  const src = resolveAssetUrl(url);

  if (!src) {
    return (
      <i
        className="bi bi-person-circle text-body-secondary"
        style={{ fontSize: `${tamanio}px`, lineHeight: 1 }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="rounded-circle"
      style={{ width: `${tamanio}px`, height: `${tamanio}px`, objectFit: 'cover' }}
    />
  );
}
