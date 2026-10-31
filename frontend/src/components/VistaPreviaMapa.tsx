interface VistaPreviaMapaProps {
  imagenSrc: string | null; // URL de la imagen (puede ser una URL local de vista previa)
  columnas: number | null;
  filas: number | null;
}

// Imagen del mapa con la grilla dibujada encima. Si las dimensiones no son válidas
// todavía, muestra solo la imagen.
export function VistaPreviaMapa({ imagenSrc, columnas, filas }: VistaPreviaMapaProps) {
  if (!imagenSrc) {
    return (
      <div className="border rounded d-flex align-items-center justify-content-center bg-body-secondary text-body-secondary py-5">
        <span>
          <i className="bi bi-image me-2" />
          Elegí una imagen para ver la vista previa
        </span>
      </div>
    );
  }

  const hayGrilla = columnas !== null && filas !== null;
  const lineas = 'rgba(255, 255, 255, 0.6)';

  return (
    <div className="border rounded overflow-hidden" style={{ position: 'relative', lineHeight: 0 }}>
      <img src={imagenSrc} alt="Vista previa del mapa" className="w-100" />
      {hayGrilla && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: [
              `linear-gradient(to right, ${lineas} 1px, transparent 1px)`,
              `linear-gradient(to bottom, ${lineas} 1px, transparent 1px)`,
            ].join(', '),
            backgroundSize: `${100 / columnas}% ${100 / filas}%`,
            boxShadow: `inset 0 0 0 1px ${lineas}`,
          }}
        />
      )}
    </div>
  );
}
