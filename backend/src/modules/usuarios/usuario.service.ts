import jwt from "jsonwebtoken";
import { usuarioRepository } from "./usuario.repository";
import { RegisterUsuarioDTO, LoginUsuarioDTO, UpdateUsuarioDTO } from "./usuario.dto";
import { hashPassword, comparePassword } from "../../lib/hash";
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../lib/errors";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

export const usuarioService = { //esto genera un objeto con las funciones de servicio para usuarios
  async register(data: RegisterUsuarioDTO) {
    const usuarioExistente = await usuarioRepository.findByNombre(data.nombre);
    if (usuarioExistente) {
      throw new ConflictError("El nombre de usuario ya está en uso");
    }

    const contrasenaHasheada = await hashPassword(data.contrasena); //contraseña hasheada para guardar en la base de datos
    return usuarioRepository.create({
      nombre: data.nombre,
      contrasena: contrasenaHasheada,
    });
  },

  async login(data: LoginUsuarioDTO) { //función para iniciar sesión
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

  async getProfile(id: number) { //función para obtener el perfil del usuario
    const usuario = await usuarioRepository.findById(id);
    if (!usuario || !usuario.activo) {
      throw new NotFoundError("Usuario no encontrado");
    }
    return usuario;
  },

  async update(id: number, data: UpdateUsuarioDTO, solicitadoPorId: number) { //función para actualizar el perfil del usuario
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

  async delete(id: number, solicitadoPorId: number) { //función para eliminar un usuario
    if (id !== solicitadoPorId) {
      throw new ForbiddenError("No tenés permiso para modificar este usuario");
    }

    const usuario = await usuarioRepository.findById(id);

    if (!usuario || !usuario.activo) {
      throw new NotFoundError("Usuario no encontrado");
    }
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {

      // 1. Dar de baja campañas donde el usuario es master
      await tx.campana.updateMany({
        where: { usuarioId: id },
        data: { activo: false },
      });

      // 2. Dar de baja NPCs de esas campañas
      await tx.personaje.updateMany({
        where: { tipo: "no_jugable", campana: { usuarioId: id }, },
        data: { activo: false },
      });

      // 3. Dar de baja mapas, rasgos y acciones de esas campañas
      await tx.mapa.updateMany({
        where: { campana: { usuarioId: id } },
        data: { activo: false },
      });

      await tx.rasgo.updateMany({ //Desactiva todos los rasgos específicos de campañas cuyo master es el usuario eliminado. Los rasgos generales no tienen campaña, así que no coinciden y se conservan.
        where: { campana: { usuarioId: id } },
        data: { activo: false },
      });

      await tx.accion.updateMany({ //Hace lo mismo con las acciones específicas de esas campañas. Las acciones generales también se conservan.
        where: { campana: { usuarioId: id } },
        data: { activo: false },
      });

      // 4. Objetos específicos sin instancias asociadas
      await tx.objeto.updateMany({ //Desactiva solamente objetos específicos de las campañas del usuario que no estén vinculados a ninguna instancia PersonajeCampana.
        where: {
          campana: { usuarioId: id },
          personajesCampana: { none: {} },
        },
        data: { activo: false },
      });

      // 5. Dar de baja los personajes creados por el usuario
      await tx.personaje.updateMany({
        where: { usuarioId: id },
        data: { activo: false },
      });

      // 6. Quitar al usuario de campañas como jugador pero la instancia de PersonajeCampana queda, pero sin usuario asociado. Esto permite que la campaña y el personaje sigan existiendo, pero el usuario ya no está vinculado a ellos.:
      await tx.personajeCampana.updateMany({
        where: { usuarioId: id },
        data: { usuarioId: null }, // Esto permite que la campaña y el personaje sigan existiendo, pero el usuario ya no está vinculado a ellos.
      });

      // 7. Finalmente, dar de baja al usuario
      return tx.usuario.update({
        where: { id },
        data: { activo: false },
      });
    });
  },
};