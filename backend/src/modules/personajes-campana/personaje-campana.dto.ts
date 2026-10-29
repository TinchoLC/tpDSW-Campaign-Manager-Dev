import { z } from "zod";
import { idSchema } from "../../lib/schemas";

// campanaId viene de la URL y el usuario del token: el body solo indica qué personaje se suma
export const vincularPersonajeSchema = z.object({
  personajeId: idSchema,
});

export type VincularPersonajeDTO = z.infer<typeof vincularPersonajeSchema>;
