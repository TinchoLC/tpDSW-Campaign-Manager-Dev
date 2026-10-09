import { Router } from "express";
import personajeRoutes from "../modules/personajes/personaje.routes";

const router = Router();

router.use("/personajes", personajeRoutes);

export default router;