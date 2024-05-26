import express from "express";
import { verifyAdminJwtTokenMiddleware } from "../../controllers/admin/auth";
import { updateWorkerController, updateWorkerStatusController } from "../../controllers/admin/worker";

const router = express.Router();
router.patch("/workers/:id", verifyAdminJwtTokenMiddleware, updateWorkerController);
router.patch("/workers/:id/status", verifyAdminJwtTokenMiddleware, updateWorkerStatusController);

export default router;
