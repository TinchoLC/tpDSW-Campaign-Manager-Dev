import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { rasgoController } from "./rasgo.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /rasgos:
 *   get:
 *     summary: Listar rasgos
 *     description: >
 *       Sin campanaId devuelve los rasgos generales. Con campanaId devuelve los generales
 *       más los específicos de esa campaña (solo master y jugadores). Los jugadores solo
 *       ven los rasgos con visibleAJugador = true.
 *     tags: [Rasgos]
 *     parameters:
 *       - in: query
 *         name: campanaId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de rasgos activos
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: No participás de la campaña
 *       404:
 *         description: Campaña no encontrada
 *   post:
 *     summary: Crear un rasgo
 *     description: Sin campanaId => general (solo admin). Con campanaId => específico (solo el master de esa campaña).
 *     tags: [Rasgos]
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
 *                 example: Visión en la oscuridad
 *               descripcion:
 *                 type: string
 *                 example: Ve en la oscuridad hasta 18 metros.
 *               visibleAJugador:
 *                 type: boolean
 *                 example: true
 *               nivelMinimo:
 *                 type: integer
 *                 example: 1
 *               campanaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Rasgo creado
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Sin permiso para crear este rasgo
 *       404:
 *         description: Campaña no encontrada
 */
router.get("/", rasgoController.getAll);
router.post("/", rasgoController.create);

/**
 * @swagger
 * /rasgos/{id}:
 *   get:
 *     summary: Obtener un rasgo por ID
 *     tags: [Rasgos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rasgo encontrado
 *       403:
 *         description: No participás de la campaña del rasgo
 *       404:
 *         description: Rasgo no encontrado (o no visible para vos)
 *   patch:
 *     summary: Modificar un rasgo
 *     description: General => solo admin. Específico => solo el master de su campaña. No se puede cambiar la campaña.
 *     tags: [Rasgos]
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
 *                 nullable: true
 *               visibleAJugador:
 *                 type: boolean
 *               nivelMinimo:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Rasgo actualizado
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Sin permiso para modificar este rasgo
 *       404:
 *         description: Rasgo no encontrado
 *   delete:
 *     summary: Dar de baja un rasgo (baja lógica)
 *     tags: [Rasgos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Rasgo dado de baja
 *       403:
 *         description: Sin permiso para eliminar este rasgo
 *       404:
 *         description: Rasgo no encontrado
 */
router.get("/:id", rasgoController.getOne);
router.patch("/:id", rasgoController.update);
router.delete("/:id", rasgoController.delete);

export default router;
