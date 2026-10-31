import { apiFetch } from './api';

export interface Rasgo {
  id: number;
  nombre: string;
  descripcion: string | null;
  visibleAJugador: boolean;
  nivelMinimo: number | null;
  activo: boolean;
  campanaId: number | null; // null = rasgo general
}

// Al crear, sin campanaId el rasgo es general (solo admin); con campanaId es de esa campaña (solo master)
export interface RasgoCrear {
  nombre: string;
  descripcion?: string;
  visibleAJugador: boolean;
  nivelMinimo?: number;
  campanaId?: number;
}

// Al editar se puede vaciar la descripción y el nivel mínimo (null)
export interface RasgoActualizar {
  nombre: string;
  descripcion: string | null;
  visibleAJugador: boolean;
  nivelMinimo: number | null;
}

export const rasgoService = {
  // Sin campanaId: rasgos generales. Con campanaId: generales + los de esa campaña
  listar(campanaId?: number): Promise<Rasgo[]> {
    const query = campanaId ? `?campanaId=${campanaId}` : '';
    return apiFetch<Rasgo[]>(`/rasgos${query}`);
  },

  crear(datos: RasgoCrear): Promise<Rasgo> {
    return apiFetch<Rasgo>('/rasgos', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  actualizar(id: number, datos: RasgoActualizar): Promise<Rasgo> {
    return apiFetch<Rasgo>(`/rasgos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    });
  },

  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/rasgos/${id}`, { method: 'DELETE' });
  },
};
