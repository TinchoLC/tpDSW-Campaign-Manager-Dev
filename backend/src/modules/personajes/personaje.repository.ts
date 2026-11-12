import { prisma } from "../../lib/prisma";
import { CreatePersonajeDTO, UpdateJugableDTO } from "./personaje.dto";

const rasgoSelect = {
  id: true,
  nombre: true,
  descripcion: true,
  nivelMinimo: true,
  campanaId: true,
  visibleAJugador: true,
} as const;

const rasgosPara = (rasgoIds: number[]) => rasgoIds.map((id) => ({ id }));

export const personajeRepository = {
  create(data: CreatePersonajeDTO, usuarioId: number) {
    const { rasgoIds, ...plantilla } = data;
    return prisma.personaje.create({
      data: {
        ...plantilla,
        usuarioId,
        ...(rasgoIds !== undefined && { rasgos: { connect: rasgosPara(rasgoIds) } }),
      },
    });
  },

  findById(id: number) {
    return prisma.personaje.findFirst({
      where: { id, activo: true, tipo: "jugable" },
      include: {
        instancias: true,
        rasgos: { where: { activo: true }, select: rasgoSelect },
      },
    });
  },

  findByUsuario(usuarioId: number) {
    return prisma.personaje.findMany({ where: { usuarioId, activo: true, tipo: "jugable" } });
  },

  update(id: number, data: UpdateJugableDTO) {
    const { rasgoIds, ...plantilla } = data;
    return prisma.personaje.update({
      where: { id },
      data: {
        ...plantilla,
        ...(rasgoIds !== undefined && { rasgos: { set: rasgosPara(rasgoIds) } }),
      },
    });
  },
};
