import express from "express";
import { verifyAdminJwtTokenMiddleware } from "../../controllers/admin/auth";
import { deleteAdminController, getAdminController, updateAdminController } from "../../controllers/admin/profile";

const router = express.Router();
router.patch("/profile", verifyAdminJwtTokenMiddleware, updateAdminController);
router.delete("/profile", verifyAdminJwtTokenMiddleware, deleteAdminController);
router.get("/profile/:id", verifyAdminJwtTokenMiddleware, getAdminController);

export default router;
