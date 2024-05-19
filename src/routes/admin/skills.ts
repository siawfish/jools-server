import express from "express";
import { verifyAdminJwtTokenMiddleware } from "../../controllers/admin/auth";
import { createSkillController, deleteSkillController, getSkillController, getSkillsController, updateSkillController } from "../../controllers/admin/skills";

const router = express.Router();
router.post("/skills", verifyAdminJwtTokenMiddleware, createSkillController);
router.patch("/skills/:id", verifyAdminJwtTokenMiddleware, updateSkillController);
router.delete("/skills/:id", verifyAdminJwtTokenMiddleware, deleteSkillController);
router.get("/skills", verifyAdminJwtTokenMiddleware, getSkillsController);
router.get("/skills/:id", verifyAdminJwtTokenMiddleware, getSkillController);

export default router;
