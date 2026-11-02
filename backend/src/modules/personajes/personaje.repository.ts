import { prisma } from "../../lib/prisma";
import { CreatePersonajeDTO, UpdateJugableDTO, UpdateNoJugableDTO } from "./personaje.dto";

export const personajeRepository = { //repositorio de personajes que tiene los metodos de crear, actualizar, traer todos los personajes de un usuario, traer un personaje por id y eliminar un personaje por id y validar que el usuario sea el mismo que el del token y que el personaje sea jugable o no jugable y usar el schema correspondiente
  create(data: CreatePersonajeDTO, usuarioId: number) {
    const { rasgoIds, ...datosPersonaje } = data;

    return prisma.personaje.create({
      data: {
        ...datosPersonaje,
        usuarioId,
        ...(rasgoIds !== undefined && {
          rasgos: {
            connect: rasgoIds.map((id) => ({ id })),
          },
        }),
      },
    });
  },

  findById(id: number) {
    return prisma.personaje.findFirst({
      where: { id, activo: true },
      include: {
        instancias: true,
        campana: true,
        rasgos: {
          where: { activo: true },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            nivelMinimo: true,
            campanaId: true,
            visibleAJugador: true,
          },
        },
      },
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

findNpcsByCampana(campanaId: number, estadoAgresion?: string) {
  return prisma.personaje.findMany({
    where: {
      campanaId,
      tipo: "no_jugable",
      activo: true,
      ...(estadoAgresion && { estadoAgresion }),
    },
    include: {
      rasgos: {
        where: {
          activo: true,
          OR: [
            { campanaId: null },
            { campanaId },
          ],
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          nivelMinimo: true,
          campanaId: true,
          visibleAJugador: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });
},

  update(
    id: number,
    data: UpdateJugableDTO | UpdateNoJugableDTO
  ) {
    const { rasgoIds, ...datosPersonaje } = data;

    return prisma.personaje.update({
      where: { id },
      data: {
        ...datosPersonaje,
        ...(rasgoIds !== undefined && {
          rasgos: {
            set: rasgoIds.map((id) => ({ id })),
          },
        }),
      },
    });
  },

  delete(id: number) {
    return prisma.personaje.update({ where: { id }, data: { activo: false } }); //soft delete: marcar como inactivo
  },
};