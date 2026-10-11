import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  registerUsuarioSchema,
  loginUsuarioSchema,
  updateUsuarioSchema,
} from "./usuario.dto";
import { usuarioService } from "./usuario.service";

const idSchema = z.coerce.number().int().positive();

export const usuarioController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerUsuarioSchema.parse(req.body);
      const usuario = await usuarioService.register(data);
      res.status(201).json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginUsuarioSchema.parse(req.body);
      const resultado = await usuarioService.login(data);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const usuario = await usuarioService.getProfile(id);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      const data = updateUsuarioSchema.parse(req.body);
      const usuario = await usuarioService.update(id, data);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      await usuarioService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
