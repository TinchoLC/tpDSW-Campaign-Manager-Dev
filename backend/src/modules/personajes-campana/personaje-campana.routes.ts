import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { personajeCampanaController } from "./personaje-campana.controller";

// ---------------------------------------------------------------
// Ruta anidada: /api/campanas/:campanaId/participantes
// (se monta en routes/index.ts; mergeParams permite leer :campanaId)
// ---------------------------------------------------------------
const router = Router({ mergeParams: true });

router.use(authMiddleware);

/**
 * @swagger
 * /campanas/{campanaId}/participantes:
 *   post:
 *     summary: Sumar un personaje jugable a la campaña
 *     description: >
 *       Lo hace el creador del personaje. Se genera una instancia (PersonajeCampana) con
 *       los datos de la plantilla y su kit inicial de objetos, acciones y rasgos
 *       (se omiten los dados de baja y los específicos de otra campaña).
 *       Si el personaje ya había sido desvinculado, retoma su instancia anterior.
 *     tags: [Participantes]
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
 *             required: [personajeId]
 *             properties:
 *               personajeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Personaje sumado a la campaña
 *       400:
 *         description: Datos inválidos, personaje no jugable o sin vidaMax
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No sos el creador del personaje, o sos el master de la campaña
 *       404:
 *         description: Campaña o personaje no encontrados
 *       409:
 *         description: El personaje ya participa, o la campaña está finalizada o eliminada
 *   get:
 *     summary: Listar los participantes activos de la campaña
 *     description: Lo ven el master y los jugadores de la campaña.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: campanaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Personajes que participan en la campaña
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No participás en esta campaña
 *       404:
 *         description: Campaña no encontrada
 */
router.post("/", personajeCampanaController.vincular);
router.get("/", personajeCampanaController.listar);

/**
 * @swagger
 * /campanas/{campanaId}/participantes/{id}:
 *   delete:
 *     summary: Desvincular un personaje de la campaña
 *     description: >
 *       Lo hace el master de la campaña o el dueño del personaje. La instancia se da de baja
 *       (baja lógica) y se quitan sus fichas de los mapas. {id} es el de la instancia.
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: campanaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Personaje desvinculado
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No sos el master ni el dueño del personaje
 *       404:
 *         description: Campaña o participante no encontrados
 *       409:
 *         description: La campaña está finalizada o eliminada
 */
router.delete("/:id", personajeCampanaController.desvincular);

export default router;
