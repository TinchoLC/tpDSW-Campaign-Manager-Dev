import { Router } from "express";
import { personajeController } from "./personaje.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware); // todas requieren estar logueado

/**
 * @swagger
 * /personajes:
 *   post:
 *     summary: Crear un personaje (jugable o NPC)
 *     tags: [Personajes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [jugable, no_jugable]
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Personaje creado
 *       400:
 *         description: Datos inválidos
 */
router.post("/", personajeController.create);

/**
 * @swagger
 * /personajes/mios:
 *   get:
 *     summary: Listar mis personajes jugables
 *     tags: [Personajes]
 *     responses:
 *       200:
 *         description: Lista de personajes del usuario autenticado
 */
router.get("/mios", personajeController.misPersonajes);

/**
 * @swagger
 * /personajes/{id}:
 *   get:
 *     summary: Obtener un personaje por ID
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *       404:
 *         description: No encontrado
 */
router.get("/:id", personajeController.getOne);

router.patch("/:id", personajeController.update);

router.delete("/:id", personajeController.delete);

export default router;