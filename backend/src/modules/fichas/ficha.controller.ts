import { NextFunction, Request, Response } from "express";
import { idSchema } from "../../lib/schemas";
import { createFichaSchema, updateFichaSchema } from "./ficha.dto";
import { fichaService } from "./ficha.service";

export const fichaController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const mapaId = idSchema.parse(req.params.mapaId);
      const data = createFichaSchema.parse(req.body);

      const ficha = await fichaService.create(mapaId, data, req.user.id);
      res.status(201).json(ficha);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const data = updateFichaSchema.parse(req.body);

      const ficha = await fichaService.update(id, data, req.user.id);
      res.json(ficha);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);

      await fichaService.delete(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
