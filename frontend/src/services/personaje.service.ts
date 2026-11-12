import { apiFetch } from './api';

export interface DatosPersonaje {
  id: number;
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
  rasgos: {
    id: number;
    nombre: string;
    descripcion: string | null;
    nivelMinimo: number | null;
    campanaId: number | null;
    visibleAJugador: boolean;
  }[];
  activo: boolean;
}

export interface Personaje extends DatosPersonaje {
  tipo: 'jugable';
  clase: string | null;
  nivel: number | null;
  manaMax: number | null;
  experiencia: number | null;
  oro: number | null;
  usuarioId: number;
}

export interface PersonajeDetalle extends Personaje {
  instancias: { id: number; campanaId: number; activo: boolean }[];
}

export interface DatosPersonajeInput {
  imagenUrl?: string | null;
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
  rasgoIds?: number[];
}

export interface PersonajeInput extends DatosPersonajeInput {
  tipo?: 'jugable';
  clase?: string;
  nivel?: number;
  manaMax?: number;
  experiencia?: number;
  oro?: number;
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
