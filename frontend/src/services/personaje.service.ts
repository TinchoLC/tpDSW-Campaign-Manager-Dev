import { apiFetch } from './api';

export interface PersonajeJugable {
  id: number;
  tipo: 'jugable' | 'no_jugable';
  nombre: string;
  especie: string | null;
  clase: string | null;
  nivel: number | null;
  vidaMax: number | null;
  imagenUrl: string | null;
}

export const personajeService = {
  // Personajes jugables creados por el usuario autenticado
  mios(): Promise<PersonajeJugable[]> {
    return apiFetch<PersonajeJugable[]>('/personajes/mios');
  },
};
