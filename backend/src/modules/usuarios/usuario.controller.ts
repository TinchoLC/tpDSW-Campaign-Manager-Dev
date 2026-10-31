import { Request, Response, NextFunction } from "express";
import {
  registerUsuarioSchema,
  loginUsuarioSchema,
  updateUsuarioSchema,
} from "./usuario.dto";
import { usuarioService } from "./usuario.service";
import { idSchema } from "../../lib/schemas";

export const usuarioController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerUsuarioSchema.parse(req.body); // Validamos los datos de entrada usando Zod para asegurarnos de que cumplen con el esquema definido para el registro de usuarios
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
      const usuario = await usuarioService.update(id, data, req.user.id);
      res.json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = idSchema.parse(req.params.id);
      await usuarioService.delete(id, req.user.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
