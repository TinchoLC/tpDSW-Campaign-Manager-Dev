import jwt from "jsonwebtoken";
import { usuarioRepository } from "./usuario.repository";
import { RegisterUsuarioDTO, LoginUsuarioDTO, UpdateUsuarioDTO } from "./usuario.dto";
import { hashPassword, comparePassword } from "../../lib/hash";
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../lib/errors";

export const usuarioService = {
  async register(data: RegisterUsuarioDTO) {
    const usuarioExistente = await usuarioRepository.findByNombre(data.nombre);
    if (usuarioExistente) {
      throw new ConflictError("El nombre de usuario ya está en uso");
    }

    const contrasenaHasheada = await hashPassword(data.contrasena);
    return usuarioRepository.create({
      nombre: data.nombre,
      contrasena: contrasenaHasheada,
    });
  },

  async login(data: LoginUsuarioDTO) {
    const usuario = await usuarioRepository.findByNombre(data.nombre);
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const contrasenaValida = await comparePassword(data.contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
      },
    };
  },

  async getProfile(id: number) {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario || !usuario.activo) {
      throw new NotFoundError("Usuario no encontrado");
    }
    return usuario;
  },

  async update(id: number, data: UpdateUsuarioDTO, solicitadoPorId: number) {
    if (id !== solicitadoPorId) {
      throw new ForbiddenError("No tenés permiso para modificar este usuario");
    }
    
    const usuario = await usuarioRepository.findById(id);
    if (!usuario || !usuario.activo) {
      throw new NotFoundError("Usuario no encontrado");
    }

    if (data.nombre && data.nombre !== usuario.nombre) {
      const repetido = await usuarioRepository.findByNombre(data.nombre);
      if (repetido) {
        throw new ConflictError("El nombre de usuario ya está en uso");
      }
    }

    if (data.contrasena) {
      data.contrasena = await hashPassword(data.contrasena);
    }

    return usuarioRepository.update(id, data);
  },

  async delete(id: number, solicitadoPorId: number) {
    if (id !== solicitadoPorId) {
      throw new ForbiddenError("No tenés permiso para modificar este usuario");
    }

    const usuario = await usuarioRepository.findById(id);
    
    if (!usuario || !usuario.activo) {
      throw new NotFoundError("Usuario no encontrado");
    }
    return usuarioRepository.delete(id);
  },
};
