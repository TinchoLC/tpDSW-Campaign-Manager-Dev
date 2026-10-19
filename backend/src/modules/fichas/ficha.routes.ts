import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { fichaController } from "./ficha.controller";

// ---------------------------------------------------------------
// Ruta anidada: /api/mapas/:mapaId/fichas
// ---------------------------------------------------------------
export const fichasDeMapaRoutes = Router({ mergeParams: true });

fichasDeMapaRoutes.use(authMiddleware);

/**
 * @swagger
 * /mapas/{mapaId}/fichas:
 *   post:
 *     summary: Colocar una ficha en el mapa
 *     description: >
 *       Indicar exactamente uno de personajeId (un NPC de la campaña, solo el master)
 *       o personajeCampanaId (la instancia de un personaje jugable; el master o su dueño).
 *       La posición son celdas de la grilla, desde 0.
 *     tags: [Fichas]
 *     parameters:
 *       - in: path
 *         name: mapaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [posicionX, posicionY]
 *             properties:
 *               personajeId:
 *                 type: integer
 *               personajeCampanaId:
 *                 type: integer
 *               posicionX:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3
 *               posicionY:
 *                 type: integer
 *                 minimum: 0
 *                 example: 5
 *               estado:
 *                 type: string
 *               imagenUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ficha colocada
 *       400:
 *         description: Datos inválidos, posición fuera de la grilla o personaje que no es de la campaña
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No tenés permiso para colocar esa ficha
 *       404:
 *         description: Mapa no encontrado
 *       409:
 *         description: El personaje ya tiene ficha en el mapa, o la campaña está finalizada
 */
fichasDeMapaRoutes.post("/", fichaController.create);

// ---------------------------------------------------------------
// Rutas planas: /api/fichas/:id
// ---------------------------------------------------------------
const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /fichas/{id}:
 *   patch:
 *     summary: Mover una ficha
 *     description: El master mueve cualquier ficha; un jugador, solo las de sus personajes.
 *     tags: [Fichas]
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
 *               posicionX:
 *                 type: integer
 *                 minimum: 0
 *               posicionY:
 *                 type: integer
 *                 minimum: 0
 *               estado:
 *                 type: string
 *               imagenUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ficha actualizada
 *       400:
 *         description: Datos inválidos o posición fuera de la grilla
 *       403:
 *         description: No tenés permiso para mover esa ficha
 *       404:
 *         description: Ficha no encontrada
 *       409:
 *         description: Campaña finalizada
 *   delete:
 *     summary: Quitar una ficha del mapa
 *     description: Solo el master.
 *     tags: [Fichas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Ficha quitada
 *       403:
 *         description: Solo el master puede quitar fichas
 *       404:
 *         description: Ficha no encontrada
 *       409:
 *         description: Campaña finalizada
 */
router.patch("/:id", fichaController.update);
router.delete("/:id", fichaController.delete);

export default router;
