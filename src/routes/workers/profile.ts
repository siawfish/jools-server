import express from "express";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index.js";
import { getWorkerController, updateWorkerController, deleteWorkerController } from "../../controllers/workers/profile/index.js";

const router = express.Router();
router.get("/profile/:id", verifyWorkerJwtTokenMiddleware, getWorkerController);
router.patch("/profile", verifyWorkerJwtTokenMiddleware, updateWorkerController);
router.delete("/profile", verifyWorkerJwtTokenMiddleware, deleteWorkerController);
// router.post("/update-push-token", verifyWorkerJwtTokenMiddleware, updatePushTokenController);

export default router;
