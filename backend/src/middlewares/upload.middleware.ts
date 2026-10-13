import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { Request } from "express";
import { BadRequestError } from "../lib/errors";

export const CATEGORIAS_VALIDAS = [
  "personajes",
  "campanas",
  "mapas",
  "usuarios",
  "objetos",
] as const;

export type CategoriaUpload = (typeof CATEGORIAS_VALIDAS)[number];

const MIME_TYPES_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const storage = multer.diskStorage({
  destination: (req: Request, _file: Express.Multer.File, cb) => {
    const rawTipo = Array.isArray(req.params.tipo) ? req.params.tipo[0] : req.params.tipo;
    if (!rawTipo) {
      return cb(
        new BadRequestError("Debe especificar una categoría en la ruta (ej: /upload/personajes)"),
        ""
      );
    }
    const tipo = rawTipo.toLowerCase();

    if (!CATEGORIAS_VALIDAS.includes(tipo as CategoriaUpload)) {
      return cb(
        new BadRequestError(
          `Categoría inválida. Las categorías permitidas son: ${CATEGORIAS_VALIDAS.join(", ")}`
        ),
        ""
      );
    }

    const uploadPath = path.join(process.cwd(), "public", "uploads", tipo);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (MIME_TYPES_PERMITIDOS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WEBP, GIF)"
      )
    );
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB máximo
  },
});
