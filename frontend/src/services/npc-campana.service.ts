import { apiFetch } from './api';
import type { DatosPersonaje, DatosPersonajeInput } from './personaje.service';

export type EstadoAgresion = 'hostil' | 'neutral' | 'amistoso';

export interface NpcCampana extends DatosPersonaje {
  personajeId: number;
  campanaId: number;
  vidaActual: number | null;
  estadoAgresion: EstadoAgresion | null;
}

export interface NpcCampanaDetalle extends NpcCampana {
  campana: { nombre: string };
}

export interface NpcCampanaInput extends DatosPersonajeInput {
  vidaActual?: number | null;
  estadoAgresion?: EstadoAgresion;
}

const ruta = (campanaId: number) => `/campanas/${campanaId}/npcs`;

export const npcCampanaService = {
  listar(campanaId: number, estadoAgresion?: EstadoAgresion) {
    const query = estadoAgresion ? `?estadoAgresion=${encodeURIComponent(estadoAgresion)}` : '';
    return apiFetch<NpcCampana[]>(ruta(campanaId) + query);
  },

  obtener(campanaId: number, id: number) {
    return apiFetch<NpcCampanaDetalle>(`${ruta(campanaId)}/${id}`);
  },

  crear(campanaId: number, datos: NpcCampanaInput) {
    return apiFetch<NpcCampana>(ruta(campanaId), { method: 'POST', body: JSON.stringify(datos) });
  },

  actualizar(campanaId: number, id: number, datos: NpcCampanaInput) {
    return apiFetch<NpcCampana>(`${ruta(campanaId)}/${id}`, { method: 'PATCH', body: JSON.stringify(datos) });
  },

  eliminar(campanaId: number, id: number) {
    return apiFetch<void>(`${ruta(campanaId)}/${id}`, { method: 'DELETE' });
  },
};
