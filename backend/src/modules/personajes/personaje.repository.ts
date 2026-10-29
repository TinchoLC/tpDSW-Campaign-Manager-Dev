import { prisma } from "../../lib/prisma";
import { CreatePersonajeDTO, UpdateJugableDTO, UpdateNoJugableDTO } from "./personaje.dto";

export const personajeRepository = { //repositorio de personajes que tiene los metodos de crear, actualizar, traer todos los personajes de un usuario, traer un personaje por id y eliminar un personaje por id y validar que el usuario sea el mismo que el del token y que el personaje sea jugable o no jugable y usar el schema correspondiente
  create(data: CreatePersonajeDTO, usuarioId: number) {
    return prisma.personaje.create({
      data: { ...data, usuarioId },
    });
  },

  findById(id: number) {
    return prisma.personaje.findFirst({
      where: { id, activo: true }, //solo traer personajes activos
      include: { instancias: true, campana: true },
    });
  },

  findByUsuario(usuarioId: number, tipo?: "jugable" | "no_jugable") {
    return prisma.personaje.findMany({
      where: {
        usuarioId,
        activo: true,
        ...(tipo && { tipo })
      },
    });
  },

  update(id: number, data: UpdateJugableDTO | UpdateNoJugableDTO) {
    return prisma.personaje.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.personaje.update({ where: { id }, data: { activo: false } }); //soft delete: marcar como inactivo
  },
};