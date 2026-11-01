import { Navigate } from 'react-router-dom';

// Placeholder de la ruta "*". Por ahora mantiene el comportamiento de antes (volver a la
// raíz); quien implemente la pantalla de "no encontrado" reemplaza este archivo.
export function NoEncontrado() {
  return <Navigate to="/" replace />;
}
