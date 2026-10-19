import { z } from "zod";

// Id de ruta (/:id). Compartido por los controllers nuevos.
export const idSchema = z.coerce.number().int().positive();

// URL de una imagen subida con POST /upload/:tipo.
// Formato: /uploads/<categoria>/<timestamp>-<uuid>.<ext>
// Se valida el formato para no aceptar URLs externas ni rutas con "..".
export const urlImagenSchema = z
  .string()
  .regex(
    /^\/uploads\/[a-z]+\/[\w-]+(\.\w+)?$/,
    "La imagen debe subirse primero con POST /upload/:tipo y usar la url devuelta"
  );
