import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../lib/errors";
import { prisma } from "../lib/prisma";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token no provisto"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    const usuario = await prisma.usuario.findUnique({
        where: { id: payload.id },
        select: { id: true, tipo: true, activo: true },
    });

    // Comprobar existencia y actividad del usuario
    if (!usuario) {
      return next(new UnauthorizedError("Usuario no encontrado"));
    }
    if (!usuario.activo) {
      return next(new UnauthorizedError("Usuario no activo"));
    }
    // Revisar si dejarlo como 2 condiciones separadas para dar más información en el error o no es necesario.


    req.user = { id: usuario.id, tipo: usuario.tipo };
    next();
  } catch (err) {
    next(new UnauthorizedError("Token inválido o expirado"));
  }
}