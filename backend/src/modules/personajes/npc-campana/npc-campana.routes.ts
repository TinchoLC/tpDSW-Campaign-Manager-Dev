import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { npcCampanaController } from "./npc-campana.controller";

const router = Router({ mergeParams: true });

router.use(authMiddleware);
router.get("/", npcCampanaController.listar);
router.post("/", npcCampanaController.crear);
router.get("/:id", npcCampanaController.obtener);
router.patch("/:id", npcCampanaController.actualizar);
router.delete("/:id", npcCampanaController.eliminar);

export default router;
