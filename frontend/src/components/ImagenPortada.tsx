import { resolveAssetUrl } from '../services/api';

interface ImagenPortadaProps {
  url?: string | null;
  alt: string;
  alto: number; // en píxeles
}

// Imagen de cabecera de una card; si no hay imagen muestra un recuadro con un ícono
export function ImagenPortada({ url, alt, alto }: ImagenPortadaProps) {
  const src = resolveAssetUrl(url);

  if (!src) {
    return (
      <div
        className="card-img-top d-flex align-items-center justify-content-center bg-body-secondary text-body-secondary"
        style={{ height: `${alto}px` }}
      >
        <i className="bi bi-image fs-1" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="card-img-top"
      style={{ height: `${alto}px`, objectFit: 'cover' }}
    />
  );
}
