import { prisma } from "../../lib/prisma";
import { CreateMapaDTO, UpdateMapaDTO } from "./mapa.dto";
import { campanaAccesoSelect } from "../../lib/campana-acceso";
import { fichaInclude } from "../fichas/ficha.repository";

const campanaResumen = {
  select: { id: true, usuarioId: true, estado: true, activo: true },
} as const;


const mapaVigente = (id: number) => ({
  id,
  activo: true,
  campana: { activo: true },
});

export const mapaRepository = {

  create(campanaId: number, data: CreateMapaDTO) {
    return prisma.mapa.create({ data: { ...data, campanaId } });
  },

  findByCampana(campanaId: number) {
    return prisma.mapa.findMany({
      where: { campanaId, activo: true },
      orderBy: { id: "asc" },
    });
  },

  findById(id: number) {
    return prisma.mapa.findFirst({
      where: mapaVigente(id),
      include: { campana: { select: campanaAccesoSelect } },
    });
  },

  findByIdConFichas(id: number) {
    return prisma.mapa.findFirst({
      where: mapaVigente(id),
      include: {
        campana: { select: campanaAccesoSelect },
        fichas: { orderBy: { id: "asc" }, include: fichaInclude },
      },
    });
  },

  contarFichasFueraDeGrilla(mapaId: number, columnas: number, filas: number) {
    return prisma.fichaMapa.count({
      where: {
        mapaId,
        OR: [{ posicionX: { gte: columnas } }, { posicionY: { gte: filas } }],
      },
    });
  },

  update(id: number, data: UpdateMapaDTO) {
    return prisma.mapa.update({ where: { id }, data });
  },

  // Baja lógica.
  desactivar(id: number) {
    return prisma.mapa.update({
      where: { id },
      data: { activo: false, estado: "preparado" },
    });
  },

  // Transacción: el mapa activo anterior de la campaña pasa a "preparado" y este pasa a "en_juego". Así nunca hay dos mapas en juego a la vez.
  async activar(id: number, campanaId: number) {
    const [, mapa] = await prisma.$transaction([
      prisma.mapa.updateMany({
        where: { campanaId, estado: "en_juego" },
        data: { estado: "preparado" },
      }),
      prisma.mapa.update({ where: { id }, data: { estado: "en_juego" } }),
    ]);
    return mapa;
  },
};
