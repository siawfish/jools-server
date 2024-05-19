import express from "express";
import { meController, registerAdminController, signOutController, signinAdminController, verifyAdminJwtTokenMiddleware, verifyAdminOTPController } from "../../controllers/admin/auth";

const router = express.Router();
router.post("/register", registerAdminController);
router.post("/signIn", signinAdminController);
router.post("/verifyOTP", verifyAdminOTPController);
router.get("/me", verifyAdminJwtTokenMiddleware, meController);
router.get("/signOut", verifyAdminJwtTokenMiddleware, signOutController);

export default router;
