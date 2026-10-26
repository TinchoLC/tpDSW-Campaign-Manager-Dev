import { z } from "zod";

// OJO: en MySQL, un String de Prisma es VARCHAR(191). Si permitimos más de 191
// caracteres en la descripción, el INSERT falla con un error de la DB (P2000).
// Por eso el límite es 191 y no 500 como en campaña.
export const createRasgoSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(191).optional(),
  visibleAJugador: z.boolean().optional(), // default en DB: true
  nivelMinimo: z.number().int().positive().optional(),
  // Sin campanaId => rasgo GENERAL (solo admin). Con campanaId => específico (solo master).
  campanaId: z.number().int().positive().optional(),
});

// En el update NO se puede cambiar campanaId: un rasgo no "migra" entre campañas
// ni pasa de específico a general. nullable() permite borrar descripción/nivelMinimo.
export const updateRasgoSchema = z
  .object({
    nombre: z.string().min(1).max(100).optional(),
    descripcion: z.string().max(191).nullable().optional(),
    visibleAJugador: z.boolean().optional(),
    nivelMinimo: z.number().int().positive().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviarse al menos un campo para actualizar",
  });

export const listRasgoQuerySchema = z.object({
  campanaId: z.coerce.number().int().positive().optional(),
});

export type CreateRasgoDTO = z.infer<typeof createRasgoSchema>;
export type UpdateRasgoDTO = z.infer<typeof updateRasgoSchema>;
