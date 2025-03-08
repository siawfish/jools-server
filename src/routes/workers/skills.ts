import express from "express";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index";
import { getSkillByIdController, getSkillsController } from "../../controllers/workers/skills";

const router = express.Router();
router.get("/", verifyWorkerJwtTokenMiddleware, getSkillsController);
router.get("/:id", verifyWorkerJwtTokenMiddleware, getSkillByIdController);

export default router;
