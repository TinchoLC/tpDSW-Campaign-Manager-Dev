import { prisma } from "../../../lib/prisma";
import { CreateNpcCampanaDTO, UpdateNpcCampanaDTO } from "./npc-campana.dto";

const rasgosEnCampana = (campanaId: number) => ({
  where: { activo: true, OR: [{ campanaId: null }, { campanaId }] },
});

export const npcCampanaRepository = {
  create(data: CreateNpcCampanaDTO, campanaId: number, usuarioId: number) {
    const { estadoAgresion, rasgoIds, ...base } = data;
    return prisma.$transaction(async (tx) => {
      const personaje = await tx.personaje.create({
        data: { ...base, tipo: "no_jugable", usuarioId },
      });
      return tx.npcCampana.create({
        data: {
          ...base,
          estadoAgresion,
          campanaId,
          personajeId: personaje.id,
          ...(rasgoIds && { rasgos: { connect: rasgoIds.map((id) => ({ id })) } }),
        },
      });
    });
  },

  findById(id: number, campanaId: number) {
    return prisma.npcCampana.findFirst({
      where: { id, campanaId, activo: true },
      include: {
        rasgos: rasgosEnCampana(campanaId),
        campana: { select: { nombre: true } },
      },
    });
  },

  findByCampana(campanaId: number, estadoAgresion?: string) {
    return prisma.npcCampana.findMany({
      where: { campanaId, activo: true, estadoAgresion },
      include: { rasgos: rasgosEnCampana(campanaId) },
      orderBy: { id: "asc" },
    });
  },

  update(id: number, data: UpdateNpcCampanaDTO) {
    const { rasgoIds, ...datos } = data;
    return prisma.npcCampana.update({
      where: { id },
      data: {
        ...datos,
        ...(rasgoIds && { rasgos: { set: rasgoIds.map((id) => ({ id })) } }),
      },
    });
  },
};
