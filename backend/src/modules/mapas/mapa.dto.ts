import { z } from "zod";
import { urlImagenSchema } from "../../lib/schemas";

// Tamaño máximo de grilla
const dimensionSchema = z.number().int().min(1).max(100);

export const createMapaSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(500).optional(),
  imagenUrl: urlImagenSchema, // obligatoria: es el fondo del mapa (subir con POST /upload/mapas)
  columnas: dimensionSchema,
  filas: dimensionSchema,
  //  se activa con POST /mapas/:id/activar
  // "campanaId" sale de la ruta
});

export const updateMapaSchema = createMapaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviarse al menos un campo para actualizar",
  });

export type CreateMapaDTO = z.infer<typeof createMapaSchema>;
export type UpdateMapaDTO = z.infer<typeof updateMapaSchema>;
