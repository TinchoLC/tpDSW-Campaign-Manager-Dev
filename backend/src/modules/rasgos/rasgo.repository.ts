import { prisma } from "../../lib/prisma";
import { CreateRasgoDTO, UpdateRasgoDTO } from "./rasgo.dto";

export const rasgoRepository = {
  create(data: CreateRasgoDTO) {
    return prisma.rasgo.create({ data });
  },

  // Regla 8: por defecto solo registros activos
  findById(id: number) {
    return prisma.rasgo.findFirst({ where: { id, activo: true } });
  },

  // Sin campanaId: solo generales.
  // Con campanaId: generales + los específicos de esa campaña.
  // La visibilidad de los rasgos ocultos (visibleAJugador = false) se decide por separado:
  //  - generales ocultos: solo los ve el admin
  //  - específicos ocultos: solo los ve el master de la campaña
  findMany(filtros: {
    campanaId?: number;
    verGeneralesOcultos: boolean;
    verEspecificosOcultos: boolean;
  }) {
    const generales = filtros.verGeneralesOcultos
      ? { campanaId: null }
      : { campanaId: null, visibleAJugador: true };

    const especificos =
      filtros.campanaId === undefined
        ? undefined
        : filtros.verEspecificosOcultos
          ? { campanaId: filtros.campanaId }
          : { campanaId: filtros.campanaId, visibleAJugador: true };

    return prisma.rasgo.findMany({
      where: {
        activo: true,
        OR: especificos ? [generales, especificos] : [generales],
      },
      orderBy: { id: "asc" },
    });
  },

  update(id: number, data: UpdateRasgoDTO) {
    return prisma.rasgo.update({ where: { id }, data });
  },

  // Baja lógica
  desactivar(id: number) {
    return prisma.rasgo.update({ where: { id }, data: { activo: false } });
  },
};
