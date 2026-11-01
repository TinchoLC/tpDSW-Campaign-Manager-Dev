import { apiFetch } from './api';
import type { Campana } from './campana.service';

export type TipoPersonaje = 'jugable' | 'no_jugable';
export type EstadoAgresion = 'hostil' | 'neutral' | 'amistoso';

export interface Personaje {
  id: number;
  tipo: TipoPersonaje;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  especie: string | null;
  armadura: string | null;
  iniciativa: number | null;
  velocidad: number | null;
  vidaMax: number | null;
  fuerza: number | null;
  destreza: number | null;
  constitucion: number | null;
  inteligencia: number | null;
  carisma: number | null;
  sabiduria: number | null;
  // solo jugables
  clase: string | null;
  nivel: number | null;
  manaMax: number | null;
  experiencia: number | null;
  oro: number | null;
  // solo NPCs
  estadoAgresion: string | null;
  campanaId: number | null;
  usuarioId: number; // quien lo creó
  activo: boolean;
}

export interface PersonajeDetalle extends Personaje {
  campana: Campana | null;
  instancias: { id: number; campanaId: number; activo: boolean }[];
}

// Al crear se manda "tipo" (y "campanaId" si es NPC). Al editar no se pueden cambiar.
export interface PersonajeInput {
  imagenUrl?: string | null;
  tipo?: TipoPersonaje;
  campanaId?: number;
  nombre?: string;
  descripcion?: string;
  especie?: string;
  armadura?: string;
  iniciativa?: number;
  velocidad?: number;
  vidaMax?: number;
  fuerza?: number;
  destreza?: number;
  constitucion?: number;
  inteligencia?: number;
  carisma?: number;
  sabiduria?: number;
  clase?: string;
  nivel?: number;
  manaMax?: number;
  experiencia?: number;
  oro?: number;
  estadoAgresion?: EstadoAgresion;
}

export const personajeService = {
  // Personajes jugables del usuario autenticado
  mios(): Promise<Personaje[]> {
    return apiFetch<Personaje[]>('/personajes/mios');
  },

  obtener(id: number): Promise<PersonajeDetalle> {
    return apiFetch<PersonajeDetalle>(`/personajes/${id}`);
  },

  crear(datos: PersonajeInput): Promise<Personaje> {
    return apiFetch<Personaje>('/personajes', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  actualizar(id: number, datos: PersonajeInput): Promise<Personaje> {
    return apiFetch<Personaje>(`/personajes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    });
  },

  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/personajes/${id}`, { method: 'DELETE' });
  },
};

// Los componentes de #15 (ModalUnirse, CampanaDetalle) usan este nombre para los jugables propios
export type PersonajeJugable = Personaje;
