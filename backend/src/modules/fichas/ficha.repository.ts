import { prisma } from "../../lib/prisma";
import { UpdateFichaDTO } from "./ficha.dto";
import { campanaAccesoSelect } from "../../lib/campana-acceso";

export const fichaInclude = {
  personaje: { select: { id: true, nombre: true, imagenUrl: true } },
  personajeCampana: {
    select: {
      id: true,
      nombre: true,
      estado: true,
      personaje: { select: { usuarioId: true, imagenUrl: true } },
    },
  },
} as const;

export const fichaRepository = {
  // Un mapa "existe" solo si él y su campaña están activos
  findMapa(id: number) {
    return prisma.mapa.findFirst({
      where: { id, activo: true, campana: { activo: true } },
      include: { campana: { select: campanaAccesoSelect } },
    });
  },

  // Un NPC de ESA campaña (los personajes jugables entran al mapa por su instancia)
  findNpc(id: number, campanaId: number) {
    return prisma.personaje.findFirst({
      where: { id, campanaId, tipo: "no_jugable", activo: true },
      select: { id: true },
    });
  },

  // Instancia de personaje jugable de ESA campaña, con el dueño del personaje
  findInstancia(id: number, campanaId: number) {
    return prisma.personajeCampana.findFirst({
      where: { id, campanaId, activo: true },
      select: { id: true, personaje: { select: { usuarioId: true } } },
    });
  },

  findDuplicada(
    mapaId: number,
    ref: { personajeId: number } | { personajeCampanaId: number }
  ) {
    return prisma.fichaMapa.findFirst({ where: { mapaId, ...ref }, select: { id: true } });
  },

  create(
    mapaId: number,
    data: {
      posicionX: number;
      posicionY: number;
      estado?: string;
      imagenUrl?: string;
      personajeId?: number;
      personajeCampanaId?: number;
    }
  ) {
    return prisma.fichaMapa.create({
      data: { ...data, mapaId },
      include: fichaInclude,
    });
  },

  findById(id: number) {
    return prisma.fichaMapa.findFirst({
      where: { id, mapa: { activo: true, campana: { activo: true } } },
      include: {
        mapa: { include: { campana: { select: campanaAccesoSelect } }},
        personajeCampana: { select: { personaje: { select: { usuarioId: true } } } },
      },
    });
  },

  update(id: number, data: UpdateFichaDTO) {
    return prisma.fichaMapa.update({ where: { id }, data, include: fichaInclude });
  },

  // Borrado físico: una ficha es solo una posición, no tiene historial
  delete(id: number) {
    return prisma.fichaMapa.delete({ where: { id } });
  },
};
