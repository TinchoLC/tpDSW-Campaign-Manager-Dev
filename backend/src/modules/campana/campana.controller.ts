import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  createCampanaSchema,
  estadoCampanaEnum,
  updateCampanaSchema,
} from "./campana.dto";
import { campanaService } from "./campana.service";

const idSchema = z.coerce.number().int().positive();

const listQuerySchema = z.object({
  incluirInactivas: z.enum(["true", "false"]).optional(),
  estado: estadoCampanaEnum.optional(),
});

export const campanaController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createCampanaSchema.parse(req.body);
      const campana = await campanaService.create(data, req.user.id);

      res.status(201).json(campana);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { incluirInactivas, estado } = listQuerySchema.parse(req.query);

      const campanas = await campanaService.getAll(
        incluirInactivas === "true",
        estado
      );

      res.json(campanas);
    } catch (err) {
      next(err);
    }
  },

  async misCampanas(req: Request, res: Response, next: NextFunction) {
    try {
      const campanas = await campanaService.getMisCampanas(req.user.id);
      res.json(campanas);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const campana = await campanaService.getOne(id);

      res.json(campana);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const data = updateCampanaSchema.parse(req.body);

      const campana = await campanaService.update(id, data, req.user.id);
      res.json(campana);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);

      await campanaService.delete(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};