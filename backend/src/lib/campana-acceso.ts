import { prisma } from "./prisma";
import { ConflictError } from "./errors";

export type RolEnCampana = "master" | "jugador";
export const campanaAccesoSelect = {
  id: true,
  usuarioId: true,
  estado: true,
  activo: true,
} as const;

// Rol del usuario dentro de una campaña, o null si no participa.
// Jugador = tiene al menos un personaje activo (PersonajeCampana) en la campaña.
export async function getRolEnCampana(
  campana: { id: number; usuarioId: number },
  usuarioId: number
): Promise<RolEnCampana | null> {
  if (campana.usuarioId === usuarioId) return "master";

  const participa = await prisma.personajeCampana.findFirst({
    where: { campanaId: campana.id, activo: true, personaje: { usuarioId } },
    select: { id: true },
  });

  return participa ? "jugador" : null;
}

// Una campaña eliminada o finalizada no admite cambios en sus mapas ni fichas.
export function assertCampanaEscribible(campana: { activo: boolean; estado: string }) {
  if (!campana.activo) {
    throw new ConflictError("La campaña fue eliminada");
  }
  if (campana.estado === "finalizada") {
    throw new ConflictError("La campaña está finalizada y no admite cambios");
  }
}
