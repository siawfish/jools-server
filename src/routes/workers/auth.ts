import express from "express";
import {
  registerController,
  verifyWorkerPhoneNumberController,
  verifyWorkerOTPController,
  verifyWorkerJwtTokenMiddleware,
  meController,
  signOutController,
} from "../../controllers/workers/auth/index.js";

const router = express.Router();
router.post("/register", registerController);
router.get("/verifyPhoneNumber", verifyWorkerPhoneNumberController);
router.post("/verifyOTP", verifyWorkerOTPController);
router.get("/me", verifyWorkerJwtTokenMiddleware, meController);
router.get("/signOut", verifyWorkerJwtTokenMiddleware, signOutController);

export default router;
