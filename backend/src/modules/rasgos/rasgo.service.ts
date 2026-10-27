import { rasgoRepository } from "./rasgo.repository";
import { CreateRasgoDTO, UpdateRasgoDTO } from "./rasgo.dto";
import { campanaRepository } from "../campana/campana.repository";
import { getRolEnCampana } from "../../lib/campana-acceso";
import { esAdmin } from "../../lib/permisos";
import { ForbiddenError, NotFoundError } from "../../lib/errors";
import type { AuthUser } from "../../types/express";

// Una campaña eliminada se considera inexistente (findParaAcceso filtra activo: true)
async function getCampanaOrFail(campanaId: number) {
  const campana = await campanaRepository.findParaAcceso(campanaId);
  if (!campana) throw new NotFoundError("Campaña no encontrada");
  return campana;
}

// Regla 3 (autorización por fila): general => admin; específico => master DE ESA campaña
async function assertPuedeModificar(rasgo: { campanaId: number | null }, usuario: AuthUser) {
  if (rasgo.campanaId === null) {
    if (!esAdmin(usuario)) {
      throw new ForbiddenError("Solo un admin del sistema puede modificar rasgos generales");
    }
    return;
  }
  const campana = await getCampanaOrFail(rasgo.campanaId);
  if (campana.usuarioId !== usuario.id) {
    throw new ForbiddenError("Solo el master de la campaña puede modificar sus rasgos");
  }
}

async function getRasgoOrFail(id: number) {
  const rasgo = await rasgoRepository.findById(id);
  if (!rasgo) throw new NotFoundError("Rasgo no encontrado");
  return rasgo;
}

export const rasgoService = {
  async create(data: CreateRasgoDTO, usuario: AuthUser) {
    // assertPuedeModificar ya contiene exactamente la regla de "quién puede crear"
    await assertPuedeModificar({ campanaId: data.campanaId ?? null }, usuario);
    return rasgoRepository.create(data);
  },

  async getAll(campanaId: number | undefined, usuario: AuthUser) {
    const admin = esAdmin(usuario);

    if (campanaId === undefined) {
      // Solo generales: los ocultos los ve únicamente el admin
      return rasgoRepository.findMany({
        verGeneralesOcultos: admin,
        verEspecificosOcultos: false,
      });
    }

    const campana = await getCampanaOrFail(campanaId);
    const rol = await getRolEnCampana(campana, usuario.id);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden ver sus rasgos");
    }
    return rasgoRepository.findMany({
      campanaId,
      verGeneralesOcultos: admin,
      verEspecificosOcultos: rol === "master",
    });
  },

  async getOne(id: number, usuario: AuthUser) {
    const rasgo = await getRasgoOrFail(id);

    if (rasgo.campanaId === null) {
      if (!rasgo.visibleAJugador && !esAdmin(usuario)) {
        throw new NotFoundError("Rasgo no encontrado"); // 404 y no 403: no revelar que existe
      }
      return rasgo;
    }

    const campana = await getCampanaOrFail(rasgo.campanaId);
    const rol = await getRolEnCampana(campana, usuario.id);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden ver este rasgo");
    }
    if (rol !== "master" && !rasgo.visibleAJugador) {
      throw new NotFoundError("Rasgo no encontrado");
    }
    return rasgo;
  },

  async update(id: number, data: UpdateRasgoDTO, usuario: AuthUser) {
    const rasgo = await getRasgoOrFail(id);
    await assertPuedeModificar(rasgo, usuario);
    return rasgoRepository.update(id, data);
  },

  async delete(id: number, usuario: AuthUser) {
    const rasgo = await getRasgoOrFail(id);
    await assertPuedeModificar(rasgo, usuario);
    await rasgoRepository.desactivar(id);
  },
};

