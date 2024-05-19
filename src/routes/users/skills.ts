import express from "express";
import { verifyUserJwtTokenMiddleware } from "../../controllers/users/auth";
import { getSkillController, getSkillsController } from "../../controllers/users/skills";

const router = express.Router();
router.get("/skills", verifyUserJwtTokenMiddleware, getSkillsController);
router.get("/skills/:id", verifyUserJwtTokenMiddleware, getSkillController);

export default router;
