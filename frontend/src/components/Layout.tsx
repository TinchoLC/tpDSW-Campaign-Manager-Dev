import type { ReactNode } from 'react';

// Estructura común a todas las pantallas: contenido arriba y pie de página abajo.
// El header no se monta acá porque no existe en las pantallas públicas (portada, login y
// registro): lo agrega LayoutPrivado, dentro de las rutas que requieren sesión.
// Cada página sigue devolviendo su propio <main>, así no se anidan dos.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex flex-column">{children}</div>

      <footer className="container border-top py-3 text-secondary small d-flex justify-content-between gap-2 flex-wrap">
        <span>Campaign Manager · Proyecto DSW</span>
        <span>Bolzico Nicolás, Cabrera Martín, Gregoret Agustín</span>
      </footer>
    </div>
  );
}