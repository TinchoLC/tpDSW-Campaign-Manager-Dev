import { Router } from "express";
import usuarioRoutes from "../modules/usuarios/usuario.routes";
import personajeRoutes from "../modules/personajes/personaje.routes";
import campanaRoutes from "../modules/campana/campana.routes";

const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/personajes", personajeRoutes);
router.use("/campanas", campanaRoutes);

export default router;