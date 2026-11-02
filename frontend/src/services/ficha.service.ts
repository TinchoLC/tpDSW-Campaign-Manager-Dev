import { apiFetch } from './api';
import type { Ficha } from './mapa.service';

export interface ColocarFichaDTO {
  posicionX: number;
  posicionY: number;
  personajeId?: number;          // Se envía si es un NPC
  personajeCampanaId?: number;   // Se envía si es un personaje jugable
}

export interface MoverFichaDTO {
  posicionX: number;
  posicionY: number;
}

export const fichaService = {
  // Coloca una nueva ficha en el mapa
  colocar(mapaId: number, datos: ColocarFichaDTO): Promise<Ficha> {
    return apiFetch<Ficha>(`/mapas/${mapaId}/fichas`, {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  // Mueve una ficha existente a una nueva posición (X, Y)
  mover(id: number, datos: MoverFichaDTO): Promise<Ficha> {
    return apiFetch<Ficha>(`/fichas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    });
  },

  // Quita una ficha del mapa (acción del DM)
  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/fichas/${id}`, {
      method: 'DELETE',
    });
  },
};