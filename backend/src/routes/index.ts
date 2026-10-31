import { Router } from "express"; // Importamos el Router de express para poder crear rutas en nuestra aplicación
import usuarioRoutes from "../modules/usuarios/usuario.routes"; // Importamos las rutas de usuario desde el módulo correspondiente
import personajeRoutes from "../modules/personajes/personaje.routes";
import campanaRoutes from "../modules/campana/campana.routes";
import uploadRoutes from "../modules/upload/upload.routes";
import fichaRoutes, { fichasDeMapaRoutes } from "../modules/fichas/ficha.routes";
import mapaRoutes, { mapasDeCampanaRoutes } from "../modules/mapas/mapa.routes";
import rasgoRoutes from "../modules/rasgos/rasgo.routes";
import participantesRoutes from "../modules/personajes-campana/personaje-campana.routes";

const router = Router(); // Creamos una instancia del Router para definir nuestras rutas principales de la aplicación

router.use("/usuarios", usuarioRoutes);
router.use("/personajes", personajeRoutes);

// Rutas anidadas: van antes que el router base de su recurso padre
router.use("/campanas/:campanaId/mapas", mapasDeCampanaRoutes);
router.use("/campanas/:campanaId/participantes", participantesRoutes);
router.use("/campanas", campanaRoutes);

router.use("/mapas/:mapaId/fichas", fichasDeMapaRoutes);
router.use("/mapas", mapaRoutes);
router.use("/fichas", fichaRoutes);

router.use("/upload", uploadRoutes);
router.use("/rasgos", rasgoRoutes);

export default router;