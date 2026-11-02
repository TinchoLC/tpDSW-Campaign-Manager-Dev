
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
 *       Lo hace el creador del personaje. Se genera una instancia
 *       (PersonajeCampana) con los datos de la plantilla y su kit inicial.
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
 *     responses:
 *       201:
 *         description: Personaje sumado a la campaña
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Campaña o personaje no encontrados
 *       409:
 *         description: El personaje ya participa o la campaña no admite cambios
 *
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
 *   patch:
 *     summary: Modificar una instancia de PersonajeCampana
 *     description: >
 *       Permite modificar los atributos de una instancia.
 *       Solo puede hacerlo el master de la campaña o el dueño
 *       del personaje. No modifica la plantilla original.
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
 *         description: ID de la instancia PersonajeCampana
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
 *               armadura:
 *                 type: string
 *                 nullable: true
 *               iniciativa:
 *                 type: integer
 *                 nullable: true
 *               velocidad:
 *                 type: integer
 *                 nullable: true
 *               vidaMax:
 *                 type: integer
 *                 minimum: 1
 *               vidaActual:
 *                 type: integer
 *                 minimum: 0
 *               nivel:
 *                 type: integer
 *                 minimum: 1
 *               oro:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *               experiencia:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *               clase:
 *                 type: string
 *                 nullable: true
 *               manaMax:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *               manaActual:
 *                 type: integer
 *                 minimum: 0
 *                 nullable: true
 *               fuerza:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *               destreza:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *               constitucion:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *               sabiduria:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *               carisma:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *               inteligencia:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *               estado:
 *                 type: string
 *                 enum: [vivo, muerto, inconsciente]
 *     responses:
 *       200:
 *         description: Instancia modificada correctamente
 *       400:
 *         description: Datos inválidos o estadísticas inconsistentes
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No sos el master ni el dueño del personaje
 *       404:
 *         description: Campaña o participante no encontrados
 *       409:
 *         description: La campaña no admite modificaciones
 *
 *   delete:
 *     summary: Desvincular un personaje de la campaña
 *     description: >
 *       Lo hace el master de la campaña o el dueño del personaje.
 *       La instancia se da de baja y se quitan sus fichas de los mapas.
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
 *         description: La campaña no admite modificaciones
 */
router.patch("/:id", personajeCampanaController.actualizar);
router.delete("/:id", personajeCampanaController.desvincular);

export default router;
