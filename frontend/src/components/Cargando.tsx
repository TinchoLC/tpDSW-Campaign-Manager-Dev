interface CargandoProps {
  // true = ocupa toda la página (con su <main>); false = se inserta dentro de otro contenido
  pagina?: boolean;
}

export function Cargando({ pagina = false }: CargandoProps) {
  const spinner = (
    <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  return pagina ? <main className="container py-4">{spinner}</main> : spinner;
}
