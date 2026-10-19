import { NextFunction, Request, Response } from "express";
import { idSchema } from "../../lib/schemas";
import { createMapaSchema, updateMapaSchema } from "./mapa.dto";
import { mapaService } from "./mapa.service";

export const mapaController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const data = createMapaSchema.parse(req.body);

      const mapa = await mapaService.create(campanaId, data, req.user.id);
      res.status(201).json(mapa);
    } catch (err) {
      next(err);
    }
  },

  async getByCampana(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);

      const mapas = await mapaService.getByCampana(campanaId, req.user.id);
      res.json(mapas);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);

      const mapa = await mapaService.getOne(id, req.user.id);
      res.json(mapa);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const data = updateMapaSchema.parse(req.body);

      const mapa = await mapaService.update(id, data, req.user.id);
      res.json(mapa);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);

      await mapaService.delete(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async activar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);

      const mapa = await mapaService.activar(id, req.user.id);
      res.json(mapa);
    } catch (err) {
      next(err);
    }
  },
};
