import { apiFetch } from './api';

export const ESTADOS_CAMPANA = ['planificada', 'activa', 'pausada', 'finalizada'] as const;
export type EstadoCampana = (typeof ESTADOS_CAMPANA)[number];

// Opción extra del filtro del listado para no filtrar por estado
export type FiltroEstadoCampana = EstadoCampana | 'todas';

// Única fuente de los textos de cada estado (badge, filtro, etc.)
export const ETIQUETAS_ESTADO: Record<EstadoCampana, string> = {
  planificada: 'Planificada',
  activa: 'Activa',
  pausada: 'Pausada',
  finalizada: 'Finalizada',
};

export interface Campana {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  estado: EstadoCampana;
  activo: boolean;
  usuarioId: number;
  master: { id: number; nombre: string };
}

export type EstadoPersonajeCampana = 'vivo' | 'muerto' | 'inconsciente';

// Lo que ve cualquier participante de una campaña
export interface Participante {
  id: number;
  nombre: string;
  clase: string | null;
  nivel: number;
  estado: EstadoPersonajeCampana;
  vidaActual: number;
  vidaMax: number;
  personajeId: number;
  personaje: {
    imagenUrl: string | null;
    usuario: { id: number; nombre: string };
  };
}

export const campanaService = {
  listar(estado?: EstadoCampana): Promise<Campana[]> {
    const query = estado ? `?estado=${encodeURIComponent(estado)}` : '';
    return apiFetch<Campana[]>(`/campanas${query}`);
  },

  obtener(id: number): Promise<Campana> {
    return apiFetch<Campana>(`/campanas/${id}`);
  },

  // Solo responde para el master y los jugadores; al resto le devuelve 403
  participantes(campanaId: number): Promise<Participante[]> {
    return apiFetch<Participante[]>(`/campanas/${campanaId}/participantes`);
  },

  // Suma un personaje jugable propio a la campaña
  unirse(campanaId: number, personajeId: number): Promise<unknown> {
    return apiFetch<unknown>(`/campanas/${campanaId}/participantes`, {
      method: 'POST',
      body: JSON.stringify({ personajeId }),
    });
  },
};
