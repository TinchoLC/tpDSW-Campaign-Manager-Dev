import { z } from "zod";

export const registerUsuarioSchema = z.object({
  nombre: z.string().min(3).max(50),
  contrasena: z.string().min(6),
  imagenUrl: z.string().nullable().optional(),
});

export const loginUsuarioSchema = z.object({
  nombre: z.string().min(1),
  contrasena: z.string().min(1),
});

export const updateUsuarioSchema = z
  .object({
    nombre: z.string().min(3).max(50).optional(),
    contrasena: z.string().min(6).optional(),
    imagenUrl: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviarse al menos un campo para actualizar",
  });

export type RegisterUsuarioDTO = z.infer<typeof registerUsuarioSchema>;
export type LoginUsuarioDTO = z.infer<typeof loginUsuarioSchema>;
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioSchema>;
