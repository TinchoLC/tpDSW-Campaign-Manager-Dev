import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";

function esErrorDePrisma(err: unknown): err is { code: string; meta?: { target?: string[] } } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string" &&
    (err as { code: string }).code.startsWith("P")
  );
}

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (esErrorDePrisma(err)) {
    switch (err.code) {
      case "P2002": {
        const campo = err.meta?.target?.join(", ") ?? "campo";
        return res.status(409).json({ error: `Ya existe un registro con ese valor en: ${campo}` });
      }
      case "P2003":
        return res.status(400).json({ error: "Referencia inválida: el recurso relacionado no existe" });
      case "P2025":
        return res.status(404).json({ error: "El recurso solicitado no fue encontrado" });
      default:
        console.error("Error de Prisma no manejado:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  if (err instanceof Error && err.name === "ZodError") {
    return res.status(400).json({ error: "Datos inválidos", details: err.message });
  }

  console.error("Error no manejado:", err);
  return res.status(500).json({ error: "Error interno del servidor" });
}