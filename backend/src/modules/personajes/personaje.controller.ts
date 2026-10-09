import { Request, Response, NextFunction } from "express";
import { personajeService } from "./personaje.service";
import {
  createPersonajeSchema,
  updateJugableSchema,      
  updateNoJugableSchema,    
} from "./personaje.dto";

export const personajeController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createPersonajeSchema.parse(req.body);
      const personaje = await personajeService.create(data, req.user.id);
      res.status(201).json(personaje);
    } catch (err) {
      next(err); // el error handler global traduce P2003/P2002/etc a HTTP
    }
  },

async update(req: Request, res: Response, next: NextFunction) {
  try {
    const personajeExistente = await personajeService.getOne(Number(req.params.id));
    const schema = personajeExistente.tipo === "jugable" ? updateJugableSchema : updateNoJugableSchema;
    const data = schema.parse(req.body);
    const personaje = await personajeService.update(Number(req.params.id), data, req.user.id);
    res.json(personaje);
  } catch (err) {
    next(err);
  }
},
  
    async misPersonajes(req: Request, res: Response, next: NextFunction) {
    try {
      const personajes = await personajeService.getMisPersonajes(req.user.id);
      res.json(personajes);
    } catch (err) {
      next(err);
    }
  },
  
  async getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const personaje = await personajeService.getOne(Number(req.params.id));
    res.json(personaje);
  } catch (err) {
    next(err);
  }
},

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await personajeService.delete(Number(req.params.id), req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

};