import { rasgoRepository } from "./rasgo.repository";
import { CreateRasgoDTO, UpdateRasgoDTO } from "./rasgo.dto";
import { campanaRepository } from "../campana/campana.repository";
import { usuarioRepository } from "../usuarios/usuario.repository";
import { getRolEnCampana } from "../../lib/campana-acceso";
import { ForbiddenError, NotFoundError } from "../../lib/errors";

// ASUNCIÓN: Usuario.tipo === "admin" identifica al admin del sistema
// (el schema lo marca como "rol a nivel sistema").
async function esAdmin(usuarioId: number) {
  const usuario = await usuarioRepository.findById(usuarioId);
  return usuario?.tipo === "admin";
}

// Una campaña eliminada se considera inexistente (findParaAcceso filtra activo: true)
async function getCampanaOrFail(campanaId: number) {
  const campana = await campanaRepository.findParaAcceso(campanaId);
  if (!campana) throw new NotFoundError("Campaña no encontrada");
  return campana;
}

// Regla 3 (autorización por fila): general => admin; específico => master DE ESA campaña
async function assertPuedeModificar(
  rasgo: { campanaId: number | null },
  usuarioId: number) {
  if (rasgo.campanaId === null) {
    if (!(await esAdmin(usuarioId))) {
      throw new ForbiddenError("Solo un admin del sistema puede modificar rasgos generales");
    }
    return;
  }
  const campana = await getCampanaOrFail(rasgo.campanaId);
  if (campana.usuarioId !== usuarioId) {
    throw new ForbiddenError("Solo el master de la campaña puede modificar sus rasgos");
  }
}

async function getRasgoOrFail(id: number) {
  const rasgo = await rasgoRepository.findById(id);
  if (!rasgo) throw new NotFoundError("Rasgo no encontrado");
  return rasgo;
}

export const rasgoService = {
  async create(data: CreateRasgoDTO, usuarioId: number) {
    // assertPuedeModificar ya contiene exactamente la regla de "quién puede crear"
    await assertPuedeModificar({ campanaId: data.campanaId ?? null }, usuarioId);
    return rasgoRepository.create(data);
  },

  async getAll(usuarioId: number, campanaId?: number) {
    if (campanaId === undefined) {
      // Generales: el admin ve todos, el resto solo los visibles
      return rasgoRepository.findMany({ soloVisibles: !(await esAdmin(usuarioId)) });
    }

    const campana = await getCampanaOrFail(campanaId);
    const rol = await getRolEnCampana(campana, usuarioId);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden ver sus rasgos");
    }
    return rasgoRepository.findMany({ campanaId, soloVisibles: rol !== "master" });
  },

  async getOne(id: number, usuarioId: number) {
    const rasgo = await getRasgoOrFail(id);

    if (rasgo.campanaId === null) {
      if (!rasgo.visibleAJugador && !(await esAdmin(usuarioId))) {
        throw new NotFoundError("Rasgo no encontrado"); // 404 y no 403: no revelar que existe
      }
      return rasgo;
    }

    const campana = await getCampanaOrFail(rasgo.campanaId);
    const rol = await getRolEnCampana(campana, usuarioId);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden ver este rasgo");
    }
    if (rol !== "master" && !rasgo.visibleAJugador) {
      throw new NotFoundError("Rasgo no encontrado");
    }
    return rasgo;
  },

  async update(id: number, data: UpdateRasgoDTO, usuarioId: number) {
    const rasgo = await getRasgoOrFail(id);
    await assertPuedeModificar(rasgo, usuarioId);
    return rasgoRepository.update(id, data);
  },

  async delete(id: number, usuarioId: number) {
    const rasgo = await getRasgoOrFail(id);
    await assertPuedeModificar(rasgo, usuarioId);
    await rasgoRepository.desactivar(id);
  },
};
