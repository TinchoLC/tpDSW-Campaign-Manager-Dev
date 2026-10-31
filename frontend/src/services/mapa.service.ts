import { apiFetch } from './api';
import type { EstadoPersonajeCampana } from './campana.service';

export type EstadoMapa = 'preparado' | 'en_juego';

export interface Mapa {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: EstadoMapa;
  imagenUrl: string | null;
  columnas: number;
  filas: number;
  campanaId: number;
}

// Posición de un personaje en la grilla: o es un NPC (personaje) o un jugador (personajeCampana)
export interface Ficha {
  id: number;
  posicionX: number;
  posicionY: number;
  estado: string | null;
  imagenUrl: string | null;
  personaje: { id: number; nombre: string; imagenUrl: string | null } | null;
  personajeCampana: {
    id: number;
    nombre: string;
    estado: EstadoPersonajeCampana;
    personaje: { usuarioId: number; imagenUrl: string | null };
  } | null;
}

export interface MapaConFichas extends Mapa {
  fichas: Ficha[];
}

export interface CrearMapaDTO {
  nombre: string;
  descripcion?: string;
  imagenUrl: string; // la que devuelve uploadService.subirImagen('mapas', ...)
  columnas: number;
  filas: number;
}

export const mapaService = {
  // Solo el master; el mapa nace en estado "preparado"
  crear(campanaId: number, datos: CrearMapaDTO): Promise<Mapa> {
    return apiFetch<Mapa>(`/campanas/${campanaId}/mapas`, {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  // Lo ven el master y los jugadores; al resto le devuelve 403
  deCampana(campanaId: number): Promise<Mapa[]> {
    return apiFetch<Mapa[]>(`/campanas/${campanaId}/mapas`);
  },

  conFichas(mapaId: number): Promise<MapaConFichas> {
    return apiFetch<MapaConFichas>(`/mapas/${mapaId}`);
  },
};
