import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { mapaController } from "./mapa.controller";

// ---------------------------------------------------------------
// Rutas anidadas: /api/campanas/:campanaId/mapas
// (se montan en routes/index.ts; mergeParams permite leer :campanaId)
// ---------------------------------------------------------------
export const mapasDeCampanaRoutes = Router({ mergeParams: true });

mapasDeCampanaRoutes.use(authMiddleware);

/**
 * @swagger
 * /campanas/{campanaId}/mapas:
 *   get:
 *     summary: Listar los mapas de una campaña
 *     description: Lo ven el master y los jugadores de la campaña.
 *     tags: [Mapas]
 *     parameters:
 *       - in: path
 *         name: campanaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de mapas activos de la campaña
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No participás de la campaña
 *       404:
 *         description: Campaña no encontrada
 *   post:
 *     summary: Crear un mapa en una campaña
 *     description: Solo el master. La imagen se sube antes con POST /upload/mapas.
 *     tags: [Mapas]
 *     parameters:
 *       - in: path
 *         name: campanaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, imagenUrl, columnas, filas]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Mazmorra de entrada
 *               descripcion:
 *                 type: string
 *               imagenUrl:
 *                 type: string
 *                 example: /uploads/mapas/1728849-a1b2c3d4.png
 *               columnas:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 20
 *               filas:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 15
 *     responses:
 *       201:
 *         description: Mapa creado (estado "preparado")
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Solo el master puede crear mapas
 *       404:
 *         description: Campaña no encontrada
 *       409:
 *         description: Campaña finalizada o eliminada
 */
mapasDeCampanaRoutes.get("/", mapaController.getByCampana);
mapasDeCampanaRoutes.post("/", mapaController.create);

// ---------------------------------------------------------------
// Rutas planas: /api/mapas/:id
// ---------------------------------------------------------------
const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /mapas/{id}:
 *   get:
 *     summary: Obtener un mapa con sus fichas
 *     description: Lo ven el master y los jugadores de la campaña.
 *     tags: [Mapas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mapa con su grilla y sus fichas
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No participás de la campaña
 *       404:
 *         description: Mapa no encontrado
 *   patch:
 *     summary: Modificar un mapa
 *     description: Solo el master. No se puede achicar la grilla si hay fichas que quedarían fuera.
 *     tags: [Mapas]
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
 *               imagenUrl:
 *                 type: string
 *               columnas:
 *                 type: integer
 *               filas:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mapa actualizado
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Solo el master puede modificar mapas
 *       404:
 *         description: Mapa no encontrado
 *       409:
 *         description: Campaña finalizada, o hay fichas que quedarían fuera de la grilla
 *   delete:
 *     summary: Dar de baja un mapa
 *     tags: [Mapas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Mapa dado de baja
 *       403:
 *         description: Solo el master puede eliminar mapas
 *       404:
 *         description: Mapa no encontrado
 *       409:
 *         description: Campaña finalizada
 */
router.get("/:id", mapaController.getOne);
router.patch("/:id", mapaController.update);
router.delete("/:id", mapaController.delete);

/**
 * @swagger
 * /mapas/{id}/activar:
 *   post:
 *     summary: Marcar el mapa como el activo de la sesión
 *     description: Solo el master. El mapa que estaba en juego pasa a "preparado".
 *     tags: [Mapas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mapa en juego
 *       403:
 *         description: Solo el master puede activar mapas
 *       404:
 *         description: Mapa no encontrado
 *       409:
 *         description: Campaña finalizada
 */
router.post("/:id/activar", mapaController.activar);

export default router;
