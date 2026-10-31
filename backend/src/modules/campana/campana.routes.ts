import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { campanaController } from "./campana.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /campanas:
 *   get:
 *     summary: Listar campañas activas
 *     tags: [Campañas]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [planificada, activa, pausada, finalizada]
 *       - in: query
 *         name: incluirInactivas
 *         schema:
 *           type: boolean
 *         description: Si es true, incluye campañas dadas de baja.
 *     responses:
 *       200:
 *         description: Lista de campañas
 *       401:
 *         description: Token inválido o ausente
 *   post:
 *     summary: Crear una campaña
 *     tags: [Campañas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: La maldición de Strahd
 *               descripcion:
 *                 type: string
 *                 example: Campaña ambientada en Barovia.
 *               imagenUrl:
 *                 type: string
 *                 example: /uploads/strahd.png
 *     responses:
 *       201:
 *         description: Campaña creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o ausente
 */
router.get("/", campanaController.getAll);
router.post("/", campanaController.create);

/**
 * @swagger
 * /campanas/mias:
 *   get:
 *     summary: Listar las campañas creadas por el usuario autenticado
 *     tags: [Campañas]
 *     responses:
 *       200:
 *         description: Lista de campañas propias activas
 *       401:
 *         description: Token inválido o ausente
 */
router.get("/mias", campanaController.misCampanas);

/**
 * @swagger
 * /campanas/{id}:
 *   get:
 *     summary: Obtener una campaña por ID
 *     tags: [Campañas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Campaña encontrada
 *       404:
 *         description: Campaña no encontrada
 *   patch:
 *     summary: Actualizar una campaña propia
 *     tags: [Campañas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [planificada, activa, pausada, finalizada]
 *     responses:
 *       200:
 *         description: Campaña actualizada
 *       400:
 *         description: Datos inválidos o transición de estado no válida
 *       403:
 *         description: Solo el master puede modificarla
 *       404:
 *         description: Campaña no encontrada
 *       409:
 *         description: Campaña eliminada
 *   delete:
 *     summary: Dar de baja una campaña propia
 *     tags: [Campañas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Campaña dada de baja
 *       403:
 *         description: Solo el master puede eliminarla
 *       404:
 *         description: Campaña no encontrada
 *       409:
 *         description: Campaña eliminada previamente
 */
router.get("/:id", campanaController.getOne);
router.patch("/:id", campanaController.update);
router.delete("/:id", campanaController.delete);

/**
 * @swagger
 * /campanas/{id}/npcs:
 *   get:
 *     summary: Listar los NPCs de una campaña
 *     description: Solo el master de la campaña. Devuelve los personajes no jugables activos.
 *     tags: [Campañas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de NPCs activos de la campaña
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Solo el master puede ver los NPCs
 *       404:
 *         description: Campaña no encontrada
 */
router.get("/:id/npcs", campanaController.getNpcs);



router.get("/:id", campanaController.getOne);
router.patch("/:id", campanaController.update);
router.delete("/:id", campanaController.delete);

export default router;