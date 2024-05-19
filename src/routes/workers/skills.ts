import express from "express";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth";
import { getSkillController, getSkillsController } from "../../controllers/workers/skills";

const router = express.Router();
router.get("/skills", verifyWorkerJwtTokenMiddleware, getSkillsController);
router.get("/skills/:id", verifyWorkerJwtTokenMiddleware, getSkillController);

export default router;
