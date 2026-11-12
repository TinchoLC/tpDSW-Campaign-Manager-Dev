import { prisma } from "../../../lib/prisma";
import { darDeBajaNpcs } from "../../../lib/baja-logica";
import { assertCampanaEscribible } from "../../../lib/campana-acceso";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../../lib/errors";
import { campanaRepository } from "../../campana/campana.repository";
import { CreateNpcCampanaDTO, UpdateNpcCampanaDTO } from "./npc-campana.dto";
import { npcCampanaRepository } from "./npc-campana.repository";

async function buscarCampana(campanaId: number, usuarioId: number) {
  const campana = await campanaRepository.findParaAcceso(campanaId);
  if (!campana) throw new NotFoundError("Campaña no encontrada");
  if (campana.usuarioId !== usuarioId) {
    throw new ForbiddenError("Solo el master puede acceder a los NPCs de la campaña");
  }
  return campana;
}

async function buscarNpc(campanaId: number, id: number) {
  const npc = await npcCampanaRepository.findById(id, campanaId);
  if (!npc) throw new NotFoundError("NPC no encontrado");
  return npc;
}

async function validarRasgos(campanaId: number, rasgoIds?: number[]) {
  if (!rasgoIds?.length) return;
  const cantidad = await prisma.rasgo.count({
    where: {
      id: { in: rasgoIds },
      activo: true,
      AND: [
        { OR: [{ campanaId: null }, { campanaId }] },
        { OR: [{ nivelMinimo: null }, { nivelMinimo: { lte: 1 } }] },
      ],
    },
  });
  if (cantidad !== rasgoIds.length) {
    throw new BadRequestError("Uno o más rasgos no están disponibles para este NPC");
  }
}

export const npcCampanaService = {
  async listar(campanaId: number, usuarioId: number, estadoAgresion?: string) {
    await buscarCampana(campanaId, usuarioId);
    return npcCampanaRepository.findByCampana(campanaId, estadoAgresion);
  },

  async obtener(campanaId: number, id: number, usuarioId: number) {
    await buscarCampana(campanaId, usuarioId);
    return buscarNpc(campanaId, id);
  },

  async crear(campanaId: number, data: CreateNpcCampanaDTO, usuarioId: number) {
    assertCampanaEscribible(await buscarCampana(campanaId, usuarioId));
    await validarRasgos(campanaId, data.rasgoIds);
    return npcCampanaRepository.create(data, campanaId, usuarioId);
  },

  async actualizar(campanaId: number, id: number, data: UpdateNpcCampanaDTO, usuarioId: number) {
    assertCampanaEscribible(await buscarCampana(campanaId, usuarioId));
    await buscarNpc(campanaId, id);
    await validarRasgos(campanaId, data.rasgoIds);
    return npcCampanaRepository.update(id, data);
  },

  async eliminar(campanaId: number, id: number, usuarioId: number) {
    await buscarCampana(campanaId, usuarioId);
    await buscarNpc(campanaId, id);
    await prisma.$transaction((tx) => darDeBajaNpcs(tx, { id, campanaId }));
  },
};
