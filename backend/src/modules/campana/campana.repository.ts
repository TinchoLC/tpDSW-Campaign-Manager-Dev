import { prisma } from "../../lib/prisma";
import { CreateCampanaDTO, EstadoCampanaDTO, UpdateCampanaDTO } from "./campana.dto";
import { campanaAccesoSelect } from "../../lib/campana-acceso";

export const campanaRepository = {
  create(data: CreateCampanaDTO, usuarioId: number) {
    return prisma.campana.create({
      data: { ...data, usuarioId },
    });
  },

  findById(id: number) {
    return prisma.campana.findUnique({
      where: { id },
      include: { master: { select: { id: true, nombre: true } } },
    });
  },

  findMany(filtros: { soloActivas: boolean; estado?: EstadoCampanaDTO }) {
    return prisma.campana.findMany({
      where: {
        ...(filtros.soloActivas && { activo: true }),
        ...(filtros.estado && { estado: filtros.estado }),
      },
      orderBy: { id: "desc" },
      include: { master: { select: { id: true, nombre: true } } },
    });
  },

  findByUsuario(usuarioId: number) {
    return prisma.campana.findMany({
      where: { usuarioId, activo: true },
      orderBy: { id: "desc" },
    });
  },
  
    findParaAcceso(id: number) {
    return prisma.campana.findFirst({
      where: { id, activo: true },
      select: campanaAccesoSelect,
    });
  },

  update(id: number, data: UpdateCampanaDTO) {
    return prisma.campana.update({ where: { id }, data });
  },
};