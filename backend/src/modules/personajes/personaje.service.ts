import { personajeRepository } from "./personaje.repository";
import { CreatePersonajeDTO, UpdateJugableDTO } from "./personaje.dto";
import { prisma } from "../../lib/prisma";
import { darDeBajaPersonajes } from "../../lib/baja-logica";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors";

async function validarRasgos(rasgoIds: number[] | undefined, nivel: number) {
  if (!rasgoIds?.length) return;
  const cantidad = await prisma.rasgo.count({
    where: {
      id: { in: rasgoIds },
      activo: true,
      campanaId: null,
      OR: [{ nivelMinimo: null }, { nivelMinimo: { lte: nivel } }],
    },
  });
  if (cantidad !== rasgoIds.length) {
    throw new BadRequestError("Uno o más rasgos no están disponibles para este personaje");
  }
}

async function getOneVisible(id: number, usuarioId: number) {
  const personaje = await personajeRepository.findById(id);
  if (!personaje) throw new NotFoundError("Personaje no encontrado");
  if (personaje.usuarioId !== usuarioId) {
    throw new ForbiddenError("Solo el creador puede acceder a este personaje");
  }
  return personaje;
}

export const personajeService = {
  async create(data: CreatePersonajeDTO, usuarioId: number) {
    await validarRasgos(data.rasgoIds, data.nivel);
    return personajeRepository.create(data, usuarioId);
  },

  async update(id: number, data: UpdateJugableDTO, usuarioId: number) {
    const personaje = await getOneVisible(id, usuarioId);
    await validarRasgos(data.rasgoIds, data.nivel ?? personaje.nivel ?? 1);
    return personajeRepository.update(id, data);
  },

  getOneVisible,

  getMisPersonajes(usuarioId: number) {
    return personajeRepository.findByUsuario(usuarioId);
  },

  async delete(id: number, usuarioId: number) {
    await getOneVisible(id, usuarioId);
    return prisma.$transaction((tx) => darDeBajaPersonajes(tx, { id }));
  },
};
