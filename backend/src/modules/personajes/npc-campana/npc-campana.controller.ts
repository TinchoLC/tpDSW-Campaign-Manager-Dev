import { NextFunction, Request, Response } from "express";
import { idSchema } from "../../../lib/schemas";
import { createNpcCampanaSchema, listarNpcsSchema, updateNpcCampanaSchema } from "./npc-campana.dto";
import { npcCampanaService } from "./npc-campana.service";

export const npcCampanaController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const resultado = await npcCampanaService.listar(campanaId, req.user.id, listarNpcsSchema.parse(req.query).estadoAgresion);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

  async obtener(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const id = idSchema.parse(req.params.id);
      const resultado = await npcCampanaService.obtener(campanaId, id, req.user.id);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const resultado = await npcCampanaService.crear(campanaId, createNpcCampanaSchema.parse(req.body), req.user.id);
      res.status(201).json(resultado);
    } catch (err) {
      next(err);
    }
  },

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const id = idSchema.parse(req.params.id);
      const resultado = await npcCampanaService.actualizar(campanaId, id, updateNpcCampanaSchema.parse(req.body), req.user.id);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const campanaId = idSchema.parse(req.params.campanaId);
      const id = idSchema.parse(req.params.id);
      await npcCampanaService.eliminar(campanaId, id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
