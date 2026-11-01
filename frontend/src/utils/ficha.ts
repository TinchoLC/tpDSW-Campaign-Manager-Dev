import { resolveAssetUrl } from '../services/api';
import type { Ficha } from '../services/mapa.service';
import type { Personaje } from '../services/personaje.service';

const COLORES_FICHA = [
  '#0d6efd', 
  '#6610f2', 
  '#6f42c1', 
  '#d63384',
  '#dc3545', 
  '#fd7e14', 
  '#198754', 
  '#20c997', 
  '#0dcaf0', 
  '#e63946', 
  '#457b9d', 
  '#2a9d8f', 
];

// Genera un color consistente basado en el nombre del personaje
export function colorDeFicha(nombre: string): string {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0;
  }
  return COLORES_FICHA[hash % COLORES_FICHA.length];
}

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

// Color del borde según el rol y actitud:
// - Blanco: Tu personaje
// - Azul: Otros jugadores
// - Rojo: NPC Hostil
// - Verde: NPC Amistoso
// - Amarillo: NPC Neutral o sin definir
export function colorBordeFicha(ficha: Ficha, usuarioId: number, npcs: Personaje[]): string {

  if (ficha.personajeCampana) {
    if (esFichaDelUsuario(ficha, usuarioId)) {
      return '#ffffff'; 
    }
    return '#0d6efd'; 
  }

  const npc = npcs.find((n) => n.id === ficha.personaje?.id);
  const agresion = npc?.estadoAgresion?.toLowerCase();

  if (agresion === 'hostil') {
    return '#dc3545'; 
  }
  if (agresion === 'amistoso') {
    return '#198754'; 
  }
  return '#ffc107'; 
}