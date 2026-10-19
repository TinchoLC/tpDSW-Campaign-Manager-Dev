import { fichaRepository } from "./ficha.repository";
import { CreateFichaDTO, UpdateFichaDTO } from "./ficha.dto";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../lib/errors";
import { assertCampanaEscribible, getRolEnCampana } from "../../lib/campana-acceso";

function assertDentroDeGrilla(
  mapa: { columnas: number; filas: number },
  x: number,
  y: number
) {
  if (x >= mapa.columnas || y >= mapa.filas) {
    throw new BadRequestError(
      `La posición (${x}, ${y}) está fuera de la grilla de ${mapa.columnas} columnas x ${mapa.filas} filas`
    );
  }
}

export const fichaService = {
  async create(mapaId: number, data: CreateFichaDTO, usuarioId: number) {
    const mapa = await fichaRepository.findMapa(mapaId);
    if (!mapa) throw new NotFoundError("Mapa no encontrado");

    const campana = mapa.campana;
    const rol = await getRolEnCampana(campana, usuarioId);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden colocar fichas");
    }
    assertCampanaEscribible(campana);

    assertDentroDeGrilla(mapa, data.posicionX, data.posicionY);

    if (data.personajeId !== undefined) {
      // NPC: solo lo coloca el master
      if (rol !== "master") {
        throw new ForbiddenError("Solo el master puede colocar NPCs");
      }
      const npc = await fichaRepository.findNpc(data.personajeId, campana.id);
      if (!npc) {
        throw new BadRequestError("El personaje indicado no es un NPC activo de esta campaña");
      }
      if (await fichaRepository.findDuplicada(mapaId, { personajeId: data.personajeId })) {
        throw new ConflictError("Ese NPC ya tiene una ficha en este mapa");
      }
    } else if (data.personajeCampanaId !== undefined) {
      // Personaje jugable: lo coloca el master, o su dueño
      const instancia = await fichaRepository.findInstancia(data.personajeCampanaId, campana.id);
      if (!instancia) {
        throw new BadRequestError("El personaje indicado no participa de esta campaña");
      }
      if (rol !== "master" && instancia.personaje.usuarioId !== usuarioId) {
        throw new ForbiddenError("Solo podés colocar tus propios personajes");
      }
      if (
        await fichaRepository.findDuplicada(mapaId, {
          personajeCampanaId: data.personajeCampanaId,
        })
      ) {
        throw new ConflictError("Ese personaje ya tiene una ficha en este mapa");
      }
    } else {
      throw new BadRequestError("Debe indicarse personajeId o personajeCampanaId");
    }

    return fichaRepository.create(mapaId, data);
  },

  // Mover (o cambiar estado/imagen de) una ficha
  async update(id: number, data: UpdateFichaDTO, usuarioId: number) {
    const ficha = await fichaRepository.findById(id);
    if (!ficha) throw new NotFoundError("Ficha no encontrada");

    const mapa = ficha.mapa;
    const rol = await getRolEnCampana(mapa.campana, usuarioId);
    if (!rol) {
      throw new ForbiddenError("Solo el master y los jugadores de la campaña pueden mover fichas");
    }
    assertCampanaEscribible(mapa.campana);

    // El master mueve cualquier ficha; un jugador, solo las de sus personajes
    const esDuenio = ficha.personajeCampana?.personaje.usuarioId === usuarioId;
    if (rol !== "master" && !esDuenio) {
      throw new ForbiddenError("Solo podés mover las fichas de tus propios personajes");
    }

    // Las coordenadas que no se envían se mantienen
    assertDentroDeGrilla(
      mapa,
      data.posicionX ?? ficha.posicionX,
      data.posicionY ?? ficha.posicionY
    );

    return fichaRepository.update(id, data);
  },

  async delete(id: number, usuarioId: number) {
    const ficha = await fichaRepository.findById(id);
    if (!ficha) throw new NotFoundError("Ficha no encontrada");

    if (ficha.mapa.campana.usuarioId !== usuarioId) {
      throw new ForbiddenError("Solo el master puede quitar fichas del mapa");
    }
    assertCampanaEscribible(ficha.mapa.campana);

    await fichaRepository.delete(id);
  },
};
