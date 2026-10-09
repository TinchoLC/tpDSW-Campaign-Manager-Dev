import { personajeRepository } from "./personaje.repository";
import { CreatePersonajeDTO, UpdateJugableDTO, UpdateNoJugableDTO } from "./personaje.dto";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { ForbiddenError, NotFoundError, BadRequestError } from "../../lib/errors";

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
    if (data.imagenId) {
      const imagen = await prisma.imagen.findUnique({ where: { id: data.imagenId } });
      if (!imagen) throw new NotFoundError("La imagen indicada no existe");
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
  
  async delete(id: number, usuarioId: number) {
    const personaje = await personajeRepository.findById(id);
    if (!personaje) throw new NotFoundError("Personaje no encontrado");

    await assertCanModify(personaje, usuarioId);

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.personaje.delete({ where: { id } });
    });
  },

};