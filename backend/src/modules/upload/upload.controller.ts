import { Request, Response } from "express";
import { BadRequestError } from "../../lib/errors";

export const uploadController = {
  uploadImage(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequestError(
        "No se envió ningún archivo. Debe enviarse un archivo en el campo 'file'"
      );
    }

    const rawTipo = Array.isArray(req.params.tipo) ? req.params.tipo[0] : req.params.tipo;
    if (!rawTipo) {
      throw new BadRequestError("Debe especificar una categoría en la ruta");
    }
    const tipo = rawTipo.toLowerCase();
    const relativeUrl = `/uploads/${tipo}/${req.file.filename}`;

    return res.status(201).json({
      message: "Imagen subida exitosamente",
      url: relativeUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  },
};
