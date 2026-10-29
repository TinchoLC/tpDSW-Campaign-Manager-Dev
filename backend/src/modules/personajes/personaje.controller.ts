import { Request, Response, NextFunction } from "express";
import { personajeService } from "./personaje.service";
import {
  createPersonajeSchema,
  updateJugableSchema,
  updateNoJugableSchema,
} from "./personaje.dto";
import { z } from "zod";

const idSchema = z.coerce.number().int().positive(); //schema para validar que el id sea un número entero positivo

export const personajeController = { //controlador de personajes que tiene los metodos de crear, actualizar, traer todos los personajes de un usuario, traer un personaje por id y eliminar un personaje por id y validar que el usuario sea el mismo que el del token y que el personaje sea jugable o no jugable y usar el schema correspondiente
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPersonajeSchema.parse(req.body);
      const personaje = await personajeService.create(data, req.user.id);
      res.status(201).json(personaje);
    } catch (err) {
      next(err); // el error handler global traduce P2003/P2002/etc a HTTP
    }
  },

  async update(req: Request, res: Response, next: NextFunction) { //actualizar un personaje por id y usuario y validar que el tipo de personaje sea jugable o no jugable y usar el schema correspondiente
    try {
      const id = idSchema.parse(req.params.id);
      const personajeExistente = await personajeService.getOne(id);
      const schema = personajeExistente.tipo === "jugable" ? updateJugableSchema : updateNoJugableSchema;
      const data = schema.parse(req.body);
      const personaje = await personajeService.update(id, data, req.user.id);
      res.json(personaje);
    } catch (err) {
      next(err);
    }
  },

  async misPersonajes(req: Request, res: Response, next: NextFunction) { //traer todos los personajes de un usuario y validar que el usuario sea el mismo que el del token y que el personaje sea jugable o no jugable y usar el schema correspondiente
    try {
      const personajes = await personajeService.getMisPersonajes(req.user.id);
      res.json(personajes);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) { // Obtiene un personaje activo por su ID; el ID de ruta se valida con Zod.
    try {
      const id = idSchema.parse(req.params.id);
      const personaje = await personajeService.getOne(id);
      res.json(personaje);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) { //eliminar un personaje por id y validar que el usuario sea el mismo que el del token y que el personaje sea jugable o no jugable y usar el schema correspondiente
    try {
      const id = idSchema.parse(req.params.id);
      await personajeService.delete(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

};