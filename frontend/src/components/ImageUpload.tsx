import { useId, useState, useRef, type ChangeEvent } from 'react';
import { uploadService, type CategoriaImagen } from '../services/upload.service';
import { resolveAssetUrl } from '../services/api';

// Los mismos formatos que acepta el backend (upload.middleware.ts)
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface ImageUploadProps {
  tipo: CategoriaImagen;
  valorInicial?: string | null;
  onChange: (url: string | null) => void;
  etiqueta?: string;
  forma?: 'circulo' | 'rectangulo';
}

export function ImageUpload({
  tipo,
  valorInicial,
  onChange,
  etiqueta = 'Imagen',
  forma = 'rectangulo',
}: ImageUploadProps) {
  const [url, setUrl] = useState<string | null>(valorInicial ?? null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica de tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5 MB.');
      e.target.value = '';
      return;
    }

    // Validación de tipo
    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      setError('El archivo debe ser una imagen PNG, JPG, WEBP o GIF.');
      e.target.value = '';
      return;
    }

    setError(null);
    setCargando(true);

    try {
      const nuevaUrl = await uploadService.subir(tipo, file);
      setUrl(nuevaUrl);
      onChange(nuevaUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setCargando(false);
      // Limpiar input para permitir seleccionar el mismo archivo de nuevo si se desea
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleEliminar = () => {
    setUrl(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const urlCompleta = resolveAssetUrl(url);

  return (
    <div className="mb-3">
      <label htmlFor={inputId} className="form-label d-block">
        {etiqueta}
      </label>

      {/* Vista previa si hay imagen */}
      {urlCompleta && (
        <div className="mb-2 d-flex align-items-center gap-3">
          <img
            src={urlCompleta}
            alt="Vista previa"
            className={`shadow-sm border ${forma === 'circulo' ? 'rounded-circle' : 'rounded'}`}
            style={{
              width: forma === 'circulo' ? '96px' : '180px',
              height: forma === 'circulo' ? '96px' : '100px',
              objectFit: 'cover',
            }}
          />
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleEliminar}
            disabled={cargando}
          >
            <i className="bi bi-trash me-1" />
            Quitar
          </button>
        </div>
      )}

      {/* Selector de archivo */}
      <div className="d-flex align-items-center gap-2">
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={TIPOS_PERMITIDOS.join(",")}
          className="form-control form-control-sm"
          style={{ maxWidth: '320px' }}
          onChange={handleFileChange}
          disabled={cargando}
        />
        {cargando && (
          <span className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Subiendo...</span>
          </span>
        )}
      </div>

      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
}
