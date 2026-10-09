import { prisma } from "../../lib/prisma";
import { CreatePersonajeDTO, UpdateJugableDTO, UpdateNoJugableDTO } from "./personaje.dto";

export const personajeRepository = {
  create(data: CreatePersonajeDTO, usuarioId: number) {
    return prisma.personaje.create({
      data: { ...data, usuarioId },
    });
  },

  findById(id: number) {
    return prisma.personaje.findUnique({
      where: { id },
      include: { imagen: true, instancias: true, campana: true },
    });
  },

  findByUsuario(usuarioId: number, tipo?: "jugable" | "no_jugable") {
    return prisma.personaje.findMany({
      where: { usuarioId, ...(tipo && { tipo }) },
    });
  },

  update(id: number, data: UpdateJugableDTO | UpdateNoJugableDTO) {
    return prisma.personaje.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.personaje.delete({ where: { id } });
  },
};