import { Outlet } from 'react-router-dom';
import { Header } from './Header';

// Envuelve las rutas que requieren sesión iniciada
export function LayoutPrivado() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
