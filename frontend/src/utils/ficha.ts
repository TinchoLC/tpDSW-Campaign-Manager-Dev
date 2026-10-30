import { resolveAssetUrl } from '../services/api';
import type { Ficha } from '../services/mapa.service';

// Una ficha es de un jugador (personajeCampana) o de un NPC (personaje)
export function nombreDeFicha(ficha: Ficha): string {
  return ficha.personajeCampana?.nombre ?? ficha.personaje?.nombre ?? 'Ficha';
}

export function imagenDeFicha(ficha: Ficha): string | null {
  return resolveAssetUrl(
    ficha.imagenUrl ?? ficha.personajeCampana?.personaje.imagenUrl ?? ficha.personaje?.imagenUrl
  );
}

export function esNpc(ficha: Ficha): boolean {
  return ficha.personajeCampana === null;
}

export function esFichaDelUsuario(ficha: Ficha, usuarioId: number): boolean {
  return ficha.personajeCampana?.personaje.usuarioId === usuarioId;
}

// Muertos e inconscientes se muestran atenuados
export function estaCaida(ficha: Ficha): boolean {
  return ficha.personajeCampana !== null && ficha.personajeCampana.estado !== 'vivo';
}
