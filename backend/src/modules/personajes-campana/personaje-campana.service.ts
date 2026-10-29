import { personajeCampanaRepository } from "./personaje-campana.repository";
import { campanaRepository } from "../campana/campana.repository";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { darDeBajaInstancias } from "../../lib/baja-logica";
import { assertCampanaEscribible, getRolEnCampana } from "../../lib/campana-acceso";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../../lib/errors";

async function getCampanaOrFail(campanaId: number) {
  const campana = await campanaRepository.findParaAcceso(campanaId);
  if (!campana) throw new NotFoundError("Campaña no encontrada");
  return campana;
}

export const personajeCampanaService = {
  // El creador suma su personaje jugable a una campaña vigente
  async vincular(campanaId: number, personajeId: number, usuarioId: number) {
    const campana = await getCampanaOrFail(campanaId);

    if (campana.usuarioId === usuarioId) {
      throw new ForbiddenError("El master no puede participar como jugador de su propia campaña");
    }
    assertCampanaEscribible(campana);

    const personaje = await personajeCampanaRepository.findPersonajeParaVincular(personajeId, campanaId);
    if (!personaje) throw new NotFoundError("Personaje no encontrado");
    if (personaje.usuarioId !== usuarioId) {
      throw new ForbiddenError("Solo el creador del personaje puede sumarlo a una campaña");
    }
    if (personaje.tipo !== "jugable") {
      throw new BadRequestError("Solo los personajes jugables pueden participar como jugadores");
    }
    if (personaje.vidaMax == null) {
      throw new BadRequestError("El personaje necesita vidaMax definida para participar de una campaña");
    }

    const existente = await personajeCampanaRepository.findByPersonajeYCampana(personajeId, campanaId);
    if (existente?.activo) {
      throw new ConflictError("El personaje ya participa en esta campaña");
    }
    // Si fue desvinculado antes, retoma su instancia (conserva su progreso)
    if (existente) return personajeCampanaRepository.reactivar(existente.id);

    return personajeCampanaRepository.createDesdePersonaje(personaje, campanaId);
  },

  // Lo ven el master y los jugadores de la campaña
  async listar(campanaId: number, usuarioId: number) {
    const campana = await getCampanaOrFail(campanaId);

    const rol = await getRolEnCampana(campana, usuarioId);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden ver sus participantes");
    }

    return personajeCampanaRepository.findActivasByCampana(campanaId);
  },

  // Lo desvincula el master de la campaña o el dueño del personaje
  async desvincular(campanaId: number, id: number, usuarioId: number) {
    const campana = await getCampanaOrFail(campanaId);

    const instancia = await personajeCampanaRepository.findActivaEnCampana(id, campanaId);
    if (!instancia) throw new NotFoundError("El personaje no participa en esta campaña");

    const esMaster = campana.usuarioId === usuarioId;
    const esDuenio = instancia.personaje.usuarioId === usuarioId;
    if (!esMaster && !esDuenio) {
      throw new ForbiddenError("Solo el master o el dueño del personaje pueden desvincularlo");
    }
    assertCampanaEscribible(campana);

    // Baja de la instancia y de sus fichas en los mapas (lib/baja-logica.ts)
    await prisma.$transaction((tx: Prisma.TransactionClient) =>
      darDeBajaInstancias(tx, { id })
    );
  },
};
