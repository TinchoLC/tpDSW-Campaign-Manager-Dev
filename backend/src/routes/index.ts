import { Router } from "express";
import personajeRoutes from "../modules/personajes/personaje.routes";
import campanaRoutes from "../modules/campana/campana.routes";

const router = Router();

router.use("/personajes", personajeRoutes);
router.use("/campanas", campanaRoutes);
export default router;