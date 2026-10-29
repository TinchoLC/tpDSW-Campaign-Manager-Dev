import { campanaRepository } from "./campana.repository";
import { CreateCampanaDTO, EstadoCampanaDTO, UpdateCampanaDTO } from "./campana.dto";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { ForbiddenError, NotFoundError, ConflictError, BadRequestError } from "../../lib/errors";

// Transiciones válidas según "Reglas de negocio.txt":
// planificada → activa → pausada ⇄ activa → finalizada
const TRANSICIONES_VALIDAS: Record<EstadoCampanaDTO, EstadoCampanaDTO[]> = {
  planificada: ["activa"],
  activa: ["pausada", "finalizada"],
  pausada: ["activa"],
  finalizada: [], // estado terminal
};

function assertTransicionValida(actual: EstadoCampanaDTO, nuevo: EstadoCampanaDTO) {
  const permitidos = TRANSICIONES_VALIDAS[actual];
  if (!permitidos.includes(nuevo)) {
    throw new BadRequestError(
      `No se puede pasar del estado "${actual}" a "${nuevo}"`
    );
  }
}

function assertEsMaster(campana: { usuarioId: number }, usuarioId: number) {
  if (campana.usuarioId !== usuarioId) {
    throw new ForbiddenError("Solo el master puede modificar esta campaña");
  }
}

export const campanaService = {
  async create(data: CreateCampanaDTO, usuarioId: number) {
    return campanaRepository.create(data, usuarioId);
  },

  async getAll(incluirInactivas: boolean, estado?: EstadoCampanaDTO) {
    return campanaRepository.findMany({ soloActivas: !incluirInactivas, estado });
  },

  getMisCampanas(usuarioId: number) {
    return campanaRepository.findByUsuario(usuarioId);
  },

  async getOne(id: number) {
    const campana = await campanaRepository.findById(id);
    if (!campana) throw new NotFoundError("Campaña no encontrada");
    return campana;
  },

  async update(id: number, data: UpdateCampanaDTO, usuarioId: number) {
    const campana = await campanaRepository.findById(id);
    if (!campana) throw new NotFoundError("Campaña no encontrada");
    if (!campana.activo) throw new ConflictError("No se puede modificar una campaña eliminada");

    assertEsMaster(campana, usuarioId);

    if (data.estado && data.estado !== campana.estado) {
      assertTransicionValida(campana.estado as EstadoCampanaDTO, data.estado);
    }

    return campanaRepository.update(id, data);
  },

  async delete(id: number, usuarioId: number) {
    const campana = await campanaRepository.findById(id);
    if (!campana) throw new NotFoundError("Campaña no encontrada");
    if (!campana.activo) throw new ConflictError("La campaña ya se encuentra eliminada");

    assertEsMaster(campana, usuarioId);

    // Baja lógica en cascada, todo dentro de una transacción:
    // - la propia campaña
    // - los NPCs (Personaje tipo=no_jugable) asociados
    // - los objetos específicos de la campaña que NO tengan ningún
    //   PersonajeCampana asociado (si lo tienen, se conservan)
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      await tx.campana.update({ where: { id }, data: { activo: false } });

      await tx.personaje.updateMany({ // baja lógica de NPCs asociados a la campaña
        where: { campanaId: id, tipo: "no_jugable" },
        data: { activo: false },
      });

      await tx.mapa.updateMany({ // baja lógica de mapas asociados a la campaña
        where: { campanaId: id },
        data: { activo: false },
      });

      await tx.rasgo.updateMany({ // baja lógica de rasgos asociados a la campaña
        where: { campanaId: id, personajesCampana: { none: { activo: true } } },
        data: { activo: false },
      });

      await tx.accion.updateMany({ // baja lógica de acciones asociadas a la campaña
        where: { campanaId: id, personajesCampana: { none: { activo: true } } },
        data: { activo: false },
      });

      await tx.objeto.updateMany({ // baja lógica de objetos asociados a la campaña que no tengan PersonajeCampana
        where: {
          campanaId: id,
          personajesCampana: { none: { personajeCampana: { activo: true } } }, //none devuelve true si no hay ningún registro relacionado en la tabla PersonajeCampana
        },
        data: { activo: false },
      });
    });
  },
};
