import { z } from "zod";
import { estadoAgresionEnum } from "../../../lib/estadoAgresionEnum";
import { camposComunes } from "../personaje.dto";

export const createNpcCampanaSchema = camposComunes.extend({
  estadoAgresion: estadoAgresionEnum.optional(),
});

export const updateNpcCampanaSchema = createNpcCampanaSchema.partial().extend({
  vidaActual: z.number().int().nonnegative().nullable().optional(),
});

export const listarNpcsSchema = z.object({ estadoAgresion: estadoAgresionEnum.optional() });

export type CreateNpcCampanaDTO = z.infer<typeof createNpcCampanaSchema>;
export type UpdateNpcCampanaDTO = z.infer<typeof updateNpcCampanaSchema>;
