import { Prisma } from "../generated/prisma/client";

// Baja lógica en cascada de campañas. `where` selecciona las campañas:
//   { id }         -> una campaña (campana.service.delete)
//   { usuarioId }  -> todas las de un master (usuario.service.delete)
// Rasgos, acciones y objetos específicos de la campaña solo se dan de baja
// si ninguna instancia activa de jugador o NPC los usa.
export async function darDeBajaCampanas(
  tx: Prisma.TransactionClient,
  where: Prisma.CampanaWhereInput
) {
  await tx.campana.updateMany({ where, data: { activo: false } });

  await darDeBajaNpcs(tx, { campana: where });

  await tx.mapa.updateMany({ where: { campana: where }, data: { activo: false } });

  await tx.rasgo.updateMany({
    where: {
      campana: where,
      personajesCampana: { none: { activo: true } },
      npcsCampana: { none: { activo: true } },
    },
    data: { activo: false },
  });

  await tx.accion.updateMany({
    where: {
      campana: where,
      personajesCampana: { none: { activo: true } },
      npcsCampana: { none: { activo: true } },
    },
    data: { activo: false },
  });

  await tx.objeto.updateMany({
    where: {
      campana: where,
      personajesCampana: { none: { personajeCampana: { activo: true } } },
      npcsCampana: { none: { npcCampana: { activo: true } } },
    },
    data: { activo: false },
  });
}

// Baja lógica de personajes. `where` selecciona los personajes:
//   { id }         -> un personaje (personaje.service.delete)
//   { usuarioId }  -> todos los de un usuario (usuario.service.delete)
// Se quitan sus fichas de los mapas (una ficha es solo una posición) y sus
// instancias dejan de participar en las campañas.
export async function darDeBajaInstancias(
  tx: Prisma.TransactionClient,
  where: Prisma.PersonajeCampanaWhereInput
) {
  await tx.fichaMapa.deleteMany({ where: { personajeCampana: where } });
  await tx.personajeCampana.updateMany({ where, data: { activo: false } });
}

export async function darDeBajaNpcs(
  tx: Prisma.TransactionClient,
  where: Prisma.NpcCampanaWhereInput
) {
  await tx.fichaMapa.deleteMany({ where: { npcCampana: where } });
  await tx.npcCampana.updateMany({ where, data: { activo: false } });
}

export async function darDeBajaPersonajes(
  tx: Prisma.TransactionClient,
  where: Prisma.PersonajeWhereInput
) {
  await darDeBajaNpcs(tx, { personaje: where });
  await darDeBajaInstancias(tx, { personaje: where });
  await tx.personaje.updateMany({ where, data: { activo: false } });
}