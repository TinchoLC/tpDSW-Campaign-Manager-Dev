import { Router } from "express";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import { uploadController } from "./upload.controller";

const router = Router();

/**
 * @swagger
 * /upload/{tipo}:
 *   post:
 *     summary: Subir una imagen clasificada por tipo
 *     description: Sube un archivo de imagen (JPEG, PNG, WEBP, GIF hasta 5MB) a la subcarpeta seleccionada en uploads.
 *     tags: [Uploads]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [personajes, campanas, mapas, usuarios, objetos]
 *         description: Categoría de la imagen para guardarla en la subcarpeta correspondiente
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a subir
 *     responses:
 *       201:
 *         description: Imagen subida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagen subida exitosamente
 *                 url:
 *                   type: string
 *                   example: /uploads/personajes/1728849-a1b2c3d4.png
 *                 filename:
 *                   type: string
 *                 size:
 *                   type: integer
 *                 mimetype:
 *                   type: string
 *       400:
 *         description: Archivo ausente, categoría inválida o tipo de archivo no permitido
 */
router.post("/:tipo", uploadMiddleware.single("file"), uploadController.uploadImage);

export default router;
