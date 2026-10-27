import type { AuthUser } from "../types/express";

// Usuario.tipo === "admin" identifica al admin del sistema.
export function esAdmin(usuario: AuthUser): boolean {
  return usuario.tipo === "admin";
}
