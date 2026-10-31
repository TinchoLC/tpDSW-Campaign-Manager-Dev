import { personajeRepository } from "./personaje.repository";
import { CreatePersonajeDTO, UpdateJugableDTO, UpdateNoJugableDTO } from "./personaje.dto";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { darDeBajaPersonajes } from "../../lib/baja-logica";
import { campanaAccesoSelect, assertCampanaEscribible } from "../../lib/campana-acceso";
import { ForbiddenError, NotFoundError } from "../../lib/errors";


async function assertCanModify(
  personaje: { tipo: string; usuarioId: number; campanaId: number | null },
  usuarioId: number
) {
  if (personaje.tipo === "jugable") {
    if (personaje.usuarioId !== usuarioId) {
      throw new ForbiddenError("Solo el creador puede modificar este personaje");
    }
    return;
  }

  const campana = await prisma.campana.findUnique({ where: { id: personaje.campanaId! } });
  if (!campana || campana.usuarioId !== usuarioId) {
    throw new ForbiddenError("Solo el DM de la campaña puede modificar este NPC");
  }
}

export const personajeService = {
  async create(data: CreatePersonajeDTO, usuarioId: number) {
    // Un NPC solo lo puede crear el master de la campaña, y en una campaña vigente
    if (data.tipo === "no_jugable") {
      const campana = await prisma.campana.findUnique({
        where: { id: data.campanaId },
        select: campanaAccesoSelect,
      });
      if (!campana) throw new NotFoundError("La campaña indicada no existe");
      if (campana.usuarioId !== usuarioId) {
        throw new ForbiddenError("Solo el master de la campaña puede crear NPCs en ella");
      }
      assertCampanaEscribible(campana);
    }

    return personajeRepository.create(data, usuarioId);
  },

  async update(id: number, data: UpdateJugableDTO | UpdateNoJugableDTO, usuarioId: number) {
    const personaje = await personajeRepository.findById(id);
    if (!personaje) throw new NotFoundError("Personaje no encontrado");

    await assertCanModify(personaje, usuarioId);

    return personajeRepository.update(id, data);
  },

  async getOne(id: number) {
    const personaje = await personajeRepository.findById(id);
    if (!personaje) throw new NotFoundError("Personaje no encontrado");
    return personaje;
  },

  getMisPersonajes(usuarioId: number) {
    return personajeRepository.findByUsuario(usuarioId, "jugable");
  },

  async getOneVisible(id: number, usuarioId: number) {
    const personaje = await personajeRepository.findById(id);
    if (!personaje) throw new NotFoundError("Personaje no encontrado");

    if (personaje.tipo === "jugable") {
      // La plantilla la ve solo su creador
      if (personaje.usuarioId !== usuarioId) {
        throw new ForbiddenError("Solo el creador puede ver este personaje");
      }
      return personaje;
    }
    // NPC: solo el master de su campaña
    if (personaje.campana?.usuarioId !== usuarioId) {
      throw new ForbiddenError("Solo el master de la campaña puede ver este NPC");
    }
    return personaje;
  },

  async delete(id: number, usuarioId: number) {
    const personaje = await personajeRepository.findById(id);
    if (!personaje) throw new NotFoundError("Personaje no encontrado");

    await assertCanModify(personaje, usuarioId);

    return prisma.$transaction((tx: Prisma.TransactionClient) =>
      darDeBajaPersonajes(tx, { id })
    )
  },

};