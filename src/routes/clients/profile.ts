import express from "express";
import { verifyClientJwtTokenMiddleware } from "../../controllers/clients/auth/index";
import { updateClientProfileController, updatePushTokenController, updateThemeController, togglePushNotificationController } from "../../controllers/clients/profile";

const router = express.Router();
router.patch("/", verifyClientJwtTokenMiddleware, updateClientProfileController);
router.patch("/push-token", verifyClientJwtTokenMiddleware, updatePushTokenController);
router.patch("/theme", verifyClientJwtTokenMiddleware, updateThemeController);
router.patch("/push-notification", verifyClientJwtTokenMiddleware, togglePushNotificationController);

export default router;
