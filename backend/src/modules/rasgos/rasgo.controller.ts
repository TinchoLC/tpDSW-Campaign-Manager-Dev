import { NextFunction, Request, Response } from "express";
import { idSchema } from "../../lib/schemas";
import { createRasgoSchema, listRasgoQuerySchema, updateRasgoSchema } from "./rasgo.dto";
import { rasgoService } from "./rasgo.service";

export const rasgoController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createRasgoSchema.parse(req.body);
      const rasgo = await rasgoService.create(data, req.user);
      res.status(201).json(rasgo);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { campanaId } = listRasgoQuerySchema.parse(req.query);
      const rasgos = await rasgoService.getAll(campanaId, req.user);
      res.json(rasgos);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const rasgo = await rasgoService.getOne(id, req.user);
      res.json(rasgo);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const data = updateRasgoSchema.parse(req.body);
      const rasgo = await rasgoService.update(id, data, req.user);
      res.json(rasgo);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      await rasgoService.delete(id, req.user);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
