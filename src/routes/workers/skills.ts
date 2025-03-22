import express from "express";
import { getSkillByIdController, getSkillsController } from "../../controllers/workers/skills";

const router = express.Router();
router.get("/", getSkillsController);
router.get("/:id", getSkillByIdController);

export default router;
