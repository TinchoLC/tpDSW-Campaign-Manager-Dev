import { prisma } from "../../lib/prisma";

// Lo que ve cualquier participante de la campaña (no incluye estadísticas ni inventario)
const participanteSelect = {
  id: true,
  nombre: true,
  clase: true,
  nivel: true,
  estado: true,
  vidaActual: true,
  vidaMax: true,
  personajeId: true,
  personaje: {
    select: { imagenUrl: true, usuario: { select: { id: true, nombre: true } } },
  },
} as const;

// Personaje jugable activo con el kit que se copia a la instancia. Se descartan los
// objetos, acciones y rasgos dados de baja o específicos de OTRA campaña.
function buscarPersonajeParaVincular(personajeId: number, campanaId: number) {
  const delKit = { activo: true, OR: [{ campanaId: null }, { campanaId }] };

  return prisma.personaje.findFirst({
    where: { id: personajeId, activo: true },
    include: {
      objetos: { where: { objeto: delKit }, select: { objetoId: true, cantidad: true } },
      acciones: { where: delKit, select: { id: true } },
      rasgos: { where: delKit, select: { id: true } },
    },
  });
}

export type PersonajeParaVincular = NonNullable<
  Awaited<ReturnType<typeof buscarPersonajeParaVincular>>
>;

export const personajeCampanaRepository = {
  findPersonajeParaVincular: buscarPersonajeParaVincular,

  // Incluye las instancias dadas de baja: @@unique([personajeId, campanaId]) las cuenta igual
  findByPersonajeYCampana(personajeId: number, campanaId: number) {
    return prisma.personajeCampana.findUnique({
      where: { personajeId_campanaId: { personajeId, campanaId } },
    });
  },

  // Crea la instancia copiando la plantilla. vidaMax y vidaActual salen del personaje
  // (el service ya verificó que vidaMax existe). Es una sola escritura anidada, así que
  // Prisma la ejecuta de forma atómica.
  createDesdePersonaje(p: PersonajeParaVincular, campanaId: number) {
    return prisma.personajeCampana.create({
      data: {
        personajeId: p.id,
        campanaId,
        nombre: p.nombre,
        armadura: p.armadura,
        iniciativa: p.iniciativa,
        velocidad: p.velocidad,
        vidaMax: p.vidaMax!,
        vidaActual: p.vidaMax!,
        nivel: p.nivel ?? 1,
        oro: p.oro,
        experiencia: p.experiencia,
        clase: p.clase,
        manaMax: p.manaMax,
        manaActual: p.manaMax,
        fuerza: p.fuerza,
        destreza: p.destreza,
        constitucion: p.constitucion,
        sabiduria: p.sabiduria,
        carisma: p.carisma,
        inteligencia: p.inteligencia,
        objetos: { create: p.objetos.map((o) => ({ objetoId: o.objetoId, cantidad: o.cantidad })) },
        acciones: { connect: p.acciones.map((a) => ({ id: a.id })) },
        rasgos: { connect: p.rasgos.map((r) => ({ id: r.id })) },
      },
    });
  },

  reactivar(id: number) {
    return prisma.personajeCampana.update({ where: { id }, data: { activo: true } });
  },

  // Instancia activa de ESA campaña (el id solo no alcanza: evita mezclar campañas)
  findActivaEnCampana(id: number, campanaId: number) {
    return prisma.personajeCampana.findFirst({
      where: { id, campanaId, activo: true },
      select: { id: true, personaje: { select: { usuarioId: true } } },
    });
  },

  findActivasByCampana(campanaId: number) {
    return prisma.personajeCampana.findMany({
      where: { campanaId, activo: true },
      select: participanteSelect,
      orderBy: { id: "asc" },
    });
  },
};
