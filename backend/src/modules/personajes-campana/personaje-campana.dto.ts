
import { z } from "zod";
import { idSchema } from "../../lib/schemas";

// campanaId viene de la URL y el usuario del token:
// el body solo indica qué personaje se suma.
export const vincularPersonajeSchema = z.object({
  personajeId: idSchema,
});

export type VincularPersonajeDTO = z.infer<typeof vincularPersonajeSchema>;

// Campos editables de una instancia de PersonajeCampana.
// No se permite modificar sus relaciones ni su baja lógica.
export const updatePersonajeCampanaSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  armadura: z.string().nullable().optional(),
  iniciativa: z.number().int().nullable().optional(),
  velocidad: z.number().int().nullable().optional(),

  vidaMax: z.number().int().positive().optional(),
  vidaActual: z.number().int().nonnegative().optional(),

  nivel: z.number().int().positive().optional(),
  oro: z.number().int().nonnegative().nullable().optional(),
  experiencia: z.number().int().nonnegative().nullable().optional(),

  clase: z.string().nullable().optional(),

  manaMax: z.number().int().nonnegative().nullable().optional(),
  manaActual: z.number().int().nonnegative().nullable().optional(),

  fuerza: z.number().int().positive().nullable().optional(),
  destreza: z.number().int().positive().nullable().optional(),
  constitucion: z.number().int().positive().nullable().optional(),
  sabiduria: z.number().int().positive().nullable().optional(),
  carisma: z.number().int().positive().nullable().optional(),
  inteligencia: z.number().int().positive().nullable().optional(),

  estado: z.enum(["vivo", "muerto", "inconsciente"]).optional(),
})
.strict()
.refine((data) => Object.keys(data).length > 0, {
  message: "Debe indicarse al menos un campo para modificar",
});

export type UpdatePersonajeCampanaDTO = z.infer<
  typeof updatePersonajeCampanaSchema
>;
