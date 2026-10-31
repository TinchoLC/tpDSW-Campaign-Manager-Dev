import { campanaRepository } from "./campana.repository";
import { CreateCampanaDTO, EstadoCampanaDTO, UpdateCampanaDTO } from "./campana.dto";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { ForbiddenError, NotFoundError, ConflictError, BadRequestError } from "../../lib/errors";
import { darDeBajaCampanas } from "../../lib/baja-logica";
import { personajeRepository } from "../personajes/personaje.repository";


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

  // Solo el master ve los NPCs de su campaña
  async getNpcs(campanaId: number, usuarioId: number, estadoAgresion?: string) {
    const campana = await campanaRepository.findParaAcceso(campanaId);
    if (!campana) throw new NotFoundError("Campaña no encontrada");

    if (campana.usuarioId !== usuarioId) {
      throw new ForbiddenError("Solo el master puede ver los NPCs de la campaña");
    }

    return personajeRepository.findNpcsByCampana(campanaId, estadoAgresion);
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
    return prisma.$transaction((tx: Prisma.TransactionClient) =>
      darDeBajaCampanas(tx, { id })
    );
  },
};
