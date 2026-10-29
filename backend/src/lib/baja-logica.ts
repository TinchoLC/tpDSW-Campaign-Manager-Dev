import { Prisma } from "../generated/prisma/client";

// Baja lógica en cascada de campañas. `where` selecciona las campañas:
//   { id }         -> una campaña (campana.service.delete)
//   { usuarioId }  -> todas las de un master (usuario.service.delete)
// Rasgos, acciones y objetos específicos de la campaña solo se dan de baja
// si ninguna instancia ACTIVA de PersonajeCampana los usa.
export async function darDeBajaCampanas(
  tx: Prisma.TransactionClient,
  where: Prisma.CampanaWhereInput
) {
  await tx.campana.updateMany({ where, data: { activo: false } });

  await tx.personaje.updateMany({
    where: { tipo: "no_jugable", campana: where },
    data: { activo: false },
  });

  await tx.mapa.updateMany({ where: { campana: where }, data: { activo: false } });

  await tx.rasgo.updateMany({
    where: { campana: where, personajesCampana: { none: { activo: true } } },
    data: { activo: false },
  });

  await tx.accion.updateMany({
    where: { campana: where, personajesCampana: { none: { activo: true } } },
    data: { activo: false },
  });

  await tx.objeto.updateMany({
    where: {
      campana: where,
      personajesCampana: { none: { personajeCampana: { activo: true } } },
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

export async function darDeBajaPersonajes(
  tx: Prisma.TransactionClient,
  where: Prisma.PersonajeWhereInput
) {
  await tx.fichaMapa.deleteMany({ where: { personaje: where } }); // fichas de NPCs
  await darDeBajaInstancias(tx, { personaje: where });
  await tx.personaje.updateMany({ where, data: { activo: false } });
}