
import { NextFunction, Request, Response } from "express";
import { idSchema } from "../../lib/schemas";
import {
  vincularPersonajeSchema,
  updatePersonajeCampanaSchema,
} from "./personaje-campana.dto";
import { personajeCampanaService } from "./personaje-campana.service";

export const personajeCampanaController = {
  async vincular(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const { personajeId } = vincularPersonajeSchema.parse(req.body);

      const instancia = await personajeCampanaService.vincular(
        campanaId,
        personajeId,
        req.user.id
      );

      res.status(201).json(instancia);
    } catch (err) {
      next(err);
    }
  },

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);

      const participantes = await personajeCampanaService.listar(
        campanaId,
        req.user.id
      );

      res.json(participantes);
    } catch (err) {
      next(err);
    }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const id = idSchema.parse(req.params.id);

      const datos = updatePersonajeCampanaSchema.parse(req.body);

      const instancia = await personajeCampanaService.update(
        campanaId,
        id,
        datos,
        req.user.id
      );

      res.json(instancia);
    } catch (err) {
      next(err);
    }
  },

  async desvincular(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const id = idSchema.parse(req.params.id);

      await personajeCampanaService.desvincular(
        campanaId,
        id,
        req.user.id
      );

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

