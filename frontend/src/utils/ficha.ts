import { resolveAssetUrl } from '../services/api';
import type { Ficha } from '../services/mapa.service';

// Una ficha es de un jugador (personajeCampana) o de un NPC (personaje)
export function nombreDeFicha(ficha: Ficha): string {
  return (ficha.personajeCampana ? ficha.personajeCampana.nombre : ficha.personaje!.nombre);
}

export function imagenDeFicha(ficha: Ficha): string | null {
  const url = ficha.imagenUrl ?? (ficha.personajeCampana
    ? ficha.personajeCampana.personaje.imagenUrl
    : ficha.personaje!.imagenUrl);

  return resolveAssetUrl(url);
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
