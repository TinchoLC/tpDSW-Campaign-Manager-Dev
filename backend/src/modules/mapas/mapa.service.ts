import { mapaRepository } from "./mapa.repository";
import { CreateMapaDTO, UpdateMapaDTO } from "./mapa.dto";
import { ConflictError, ForbiddenError, NotFoundError } from "../../lib/errors";
import { assertCampanaEscribible, getRolEnCampana } from "../../lib/campana-acceso";
import { campanaRepository } from "../campana/campana.repository";

function assertEsMaster(campana: { usuarioId: number }, usuarioId: number) {
  if (campana.usuarioId !== usuarioId) {
    throw new ForbiddenError("Solo el master de la campaña puede administrar sus mapas");
  }
}

async function getCampanaOrFail(campanaId: number) {
  const campana = await campanaRepository.findParaAcceso(campanaId);
  if (!campana) throw new NotFoundError("Campaña no encontrada");
  return campana;
}

async function getMapaOrFail(id: number) {
  const mapa = await mapaRepository.findById(id);
  if (!mapa) throw new NotFoundError("Mapa no encontrado");
  return mapa;
}

export const mapaService = {
  async create(campanaId: number, data: CreateMapaDTO, usuarioId: number) {
    const campana = await getCampanaOrFail(campanaId);
    assertEsMaster(campana, usuarioId);
    assertCampanaEscribible(campana);

    return mapaRepository.create(campanaId, data);
  },

  // Lo ven el master y los jugadores de la campaña
  async getByCampana(campanaId: number, usuarioId: number) {
    const campana = await getCampanaOrFail(campanaId);

    const rol = await getRolEnCampana(campana, usuarioId);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden ver sus mapas");
    }

    return mapaRepository.findByCampana(campanaId);
  },

  // Detalle del mapa con sus fichas
  async getOne(id: number, usuarioId: number) {
    const mapa = await mapaRepository.findByIdConFichas(id);
    if (!mapa) throw new NotFoundError("Mapa no encontrado");

    const rol = await getRolEnCampana(mapa.campana, usuarioId);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden ver este mapa");
    }

    return mapa;
  },

  async update(id: number, data: UpdateMapaDTO, usuarioId: number) {
    const mapa = await getMapaOrFail(id);
    assertEsMaster(mapa.campana, usuarioId);
    assertCampanaEscribible(mapa.campana);

    // Si la grilla se achica, ninguna ficha puede quedar fuera
    const columnas = data.columnas ?? mapa.columnas;
    const filas = data.filas ?? mapa.filas;
    if (columnas < mapa.columnas || filas < mapa.filas) {
      const fuera = await mapaRepository.contarFichasFueraDeGrilla(id, columnas, filas);
      if (fuera > 0) {
        throw new ConflictError(
          `No se puede achicar la grilla: ${fuera} ficha(s) quedarían fuera. Movelas primero.`
        );
      }
    }

    return mapaRepository.update(id, data);
  },

  async delete(id: number, usuarioId: number) {
    const mapa = await getMapaOrFail(id);
    assertEsMaster(mapa.campana, usuarioId);
    assertCampanaEscribible(mapa.campana);

    await mapaRepository.desactivar(id);
  },

  // Marca este mapa como el activo de la sesión
  async activar(id: number, usuarioId: number) {
    const mapa = await getMapaOrFail(id);
    assertEsMaster(mapa.campana, usuarioId);
    assertCampanaEscribible(mapa.campana);

    return mapaRepository.activar(id, mapa.campanaId);
  },
};
