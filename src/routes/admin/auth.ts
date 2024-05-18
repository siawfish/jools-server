import express from "express";
import { meController, registerAdminController, signOutController, verifyAdminJwtTokenMiddleware, verifyAdminOTPController } from "../../controllers/admin/auth";

const router = express.Router();
router.post("/register", registerAdminController);
router.post("/verifyOTP", verifyAdminOTPController);
router.get("/me", verifyAdminJwtTokenMiddleware, meController);
router.get("/signOut", verifyAdminJwtTokenMiddleware, signOutController);

export default router;
