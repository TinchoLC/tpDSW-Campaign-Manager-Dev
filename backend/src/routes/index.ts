import { Router } from "express";
import usuarioRoutes from "../modules/usuarios/usuario.routes";
import personajeRoutes from "../modules/personajes/personaje.routes";
import campanaRoutes from "../modules/campana/campana.routes";
import uploadRoutes from "../modules/upload/upload.routes";
import fichasDeMapaRoutes from "../modules/fichas/ficha.routes";
import mapasDeCampanaRoutes from "../modules/mapas/mapa.routes";
import rasgoRoutes from "../modules/rasgos/rasgo.routes";


const router = Router();

router.use("/usuarios", usuarioRoutes);
router.use("/personajes", personajeRoutes);
router.use("/campanas", campanaRoutes);
router.use("/upload", uploadRoutes);
router.use("/fichas", fichasDeMapaRoutes);
router.use("/mapas", mapasDeCampanaRoutes);
router.use("/rasgos", rasgoRoutes);
export default router;