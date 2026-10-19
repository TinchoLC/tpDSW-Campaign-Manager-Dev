import { z } from "zod";
import { urlImagenSchema } from "../../lib/schemas";

// Coordenadas de grilla: celdas enteras desde 0.
// El límite superior depende del mapa (columnas/filas) y se valida en el service.
const coordenadaSchema = z.number().int().min(0);
const idRefSchema = z.number().int().positive();

export const createFichaSchema = z
  .object({
    // Exactamente uno de los dos:
    personajeId: idRefSchema.optional(), // un NPC de la campaña
    personajeCampanaId: idRefSchema.optional(), // la instancia de un personaje jugable
    posicionX: coordenadaSchema,
    posicionY: coordenadaSchema,
    estado: z.string().max(50).optional(),
    imagenUrl: urlImagenSchema.optional(),
  })
  .refine((d) => (d.personajeId !== undefined) !== (d.personajeCampanaId !== undefined), {
    message: "Debe indicarse exactamente uno de personajeId o personajeCampanaId",
  });

// Mover una ficha: no se puede cambiar a qué personaje pertenece ni de mapa
export const updateFichaSchema = z
  .object({
    posicionX: coordenadaSchema.optional(),
    posicionY: coordenadaSchema.optional(),
    estado: z.string().max(50).optional(),
    imagenUrl: urlImagenSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviarse al menos un campo para actualizar",
  });

export type CreateFichaDTO = z.infer<typeof createFichaSchema>;
export type UpdateFichaDTO = z.infer<typeof updateFichaSchema>;
