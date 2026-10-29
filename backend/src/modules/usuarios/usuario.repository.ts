import { prisma } from "../../lib/prisma";
import { UpdateUsuarioDTO } from "./usuario.dto";

export const usuarioRepository = {
  create(data: { nombre: string; contrasena: string }) {
    return prisma.usuario.create({
      data,
      select: { id: true, nombre: true, tipo: true, activo: true },
    });
  },

  findByNombre(nombre: string) {
    return prisma.usuario.findUnique({
      where: { nombre },
    });
  },

  findById(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nombre: true, tipo: true, activo: true },
    });
  },

  update(id: number, data: UpdateUsuarioDTO) {
    return prisma.usuario.update({
      where: { id },
      data,
      select: { id: true, nombre: true, tipo: true, activo: true },
    });
  },
};
