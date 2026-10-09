import { z } from "zod";

// Campos que comparten tanto Jugable como NoJugable
const camposComunes = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().optional(),
  especie: z.string().optional(),
  imagenId: z.number().int().positive().optional(),
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
});

const createJugableSchema = camposComunes.extend({
  tipo: z.literal("jugable"),
  clase: z.string().optional(),
  nivel: z.number().int().positive().default(1),
  manaMax: z.number().int().nonnegative().optional(),
  experiencia: z.number().int().nonnegative().optional(),
  oro: z.number().int().nonnegative().optional(),
});

const createNoJugableSchema = camposComunes.extend({
  tipo: z.literal("no_jugable"),
  estadoAgresion: z.enum(["hostil", "neutral", "amistoso"]).optional(),
  campanaId: z.number().int().positive(), // obligatorio: los NPCs se crean directo en una campaña
});

// usuarioId NO va en ningún schema: sale del usuario autenticado, nunca del body

export const createPersonajeSchema = z.discriminatedUnion("tipo", [
  createJugableSchema,
  createNoJugableSchema,
]);

// Para el update no se permite cambiar "tipo", así que no se puede reusar el discriminatedUnion
export const updateJugableSchema = createJugableSchema.omit({ tipo: true }).partial();
export const updateNoJugableSchema = createNoJugableSchema.omit({ tipo: true }).partial();

export type CreatePersonajeDTO = z.infer<typeof createPersonajeSchema>;
export type UpdateJugableDTO = z.infer<typeof updateJugableSchema>;
export type UpdateNoJugableDTO = z.infer<typeof updateNoJugableSchema>;
