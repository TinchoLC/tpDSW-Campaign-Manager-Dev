import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { usuarioController } from "./usuario.controller";

const router = Router();

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, contrasena]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: nombre
 *               contrasena:
 *                 type: string
 *                 example: password
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Nombre de usuario ya en uso
 */
router.post("/register", usuarioController.register);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Usuarios]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, contrasena]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: nombre
 *               contrasena:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", usuarioController.login);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener perfil de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *   patch:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
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
 *               contrasena:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     summary: Dar de baja un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario dado de baja
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", authMiddleware, usuarioController.getProfile);
router.patch("/:id", authMiddleware, usuarioController.update);
router.delete("/:id", authMiddleware, usuarioController.delete);

export default router;
