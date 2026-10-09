import { z } from "zod";

// Mismo set de valores que el enum EstadoCampana de prisma/schema.prisma
export const estadoCampanaEnum = z.enum([
  "planificada",
  "activa",
  "pausada",
  "finalizada",
]);

export const createCampanaSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(500).optional(),
  // "estado" NO se recibe al crear: toda campaña nace en "planificada"
  // "usuarioId" (master) NO va en el body: sale del usuario autenticado
});

export const updateCampanaSchema = z
  .object({
    nombre: z.string().min(1).max(100).optional(),
    descripcion: z.string().max(500).optional(),
    estado: estadoCampanaEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviarse al menos un campo para actualizar",
  });

export type EstadoCampanaDTO = z.infer<typeof estadoCampanaEnum>;
export type CreateCampanaDTO = z.infer<typeof createCampanaSchema>;
export type UpdateCampanaDTO = z.infer<typeof updateCampanaSchema>;