import express from "express";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index";
import { updateWorkerProfileController, updatePushTokenController, updateThemeController, togglePushNotificationController } from "../../controllers/workers/profile";

const router = express.Router();
router.patch("/", verifyWorkerJwtTokenMiddleware, updateWorkerProfileController);
router.patch("/push-token", verifyWorkerJwtTokenMiddleware, updatePushTokenController);
router.patch("/theme", verifyWorkerJwtTokenMiddleware, updateThemeController);
router.patch("/push-notification", verifyWorkerJwtTokenMiddleware, togglePushNotificationController);

export default router;
