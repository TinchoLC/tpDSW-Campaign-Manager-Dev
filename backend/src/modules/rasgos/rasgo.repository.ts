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
  // Con campanaId: generales + los específicos de esa campaña (lo "disponible" ahí).
  findMany(filtros: { campanaId?: number; soloVisibles: boolean }) {
    return prisma.rasgo.findMany({
      where: {
        activo: true,
        ...(filtros.campanaId === undefined
          ? { campanaId: null }
          : { OR: [{ campanaId: null }, { campanaId: filtros.campanaId }] }),
        ...(filtros.soloVisibles && { visibleAJugador: true }),
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
