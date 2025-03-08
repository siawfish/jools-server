import express from "express";
import { meController, registerController, signOutController, verifyClientJwtTokenMiddleware, verifyClientOTPController, verifyClientPhoneNumberController } from "../../controllers/clients/auth";

const router = express.Router();
router.post("/register", registerController);
router.get("/verifyPhoneNumber", verifyClientPhoneNumberController);
router.post("/verifyOTP", verifyClientOTPController);
router.get("/me", verifyClientJwtTokenMiddleware, meController);
router.get("/signOut", verifyClientJwtTokenMiddleware, signOutController);

export default router;
