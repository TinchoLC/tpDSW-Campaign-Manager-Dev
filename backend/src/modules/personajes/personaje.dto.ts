import { z } from "zod";

const rasgoIdsSchema = z
  .array(z.number().int().positive())
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "No se pueden repetir rasgos",
  })
  .optional();

// Campos que comparten tanto Jugable como NoJugable
export const camposComunes = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(500).optional(),
  especie: z.string().optional(),
  imagenUrl: z.string().nullable().optional(),
  armadura: z.string().optional(),
  iniciativa: z.number().int().optional(),
  velocidad: z.number().int().optional(),
  vidaMax: z.number().int().positive().optional(),
  fuerza: z.number().int().positive().optional(),
  destreza: z.number().int().positive().optional(),
  constitucion: z.number().int().positive().optional(),
  inteligencia: z.number().int().positive().optional(),
  carisma: z.number().int().positive().optional(),
  sabiduria: z.number().int().positive().optional(),
  rasgoIds: rasgoIdsSchema,
});

export const createPersonajeSchema = camposComunes.extend({
  tipo: z.literal("jugable"),
  clase: z.string().optional(),
  nivel: z.number().int().positive().default(1),
  manaMax: z.number().int().nonnegative().optional(),
  experiencia: z.number().int().nonnegative().optional(),
  oro: z.number().int().nonnegative().optional(),
});

export const updateJugableSchema = createPersonajeSchema.omit({ tipo: true }).partial();

export type CreatePersonajeDTO = z.infer<typeof createPersonajeSchema>;
export type UpdateJugableDTO = z.infer<typeof updateJugableSchema>;
