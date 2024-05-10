import express from "express";
import {
  registerUserController,
  verifyUserPhoneNumberController,
  verifyUserOTPController,
  verifyUserJwtTokenMiddleware,
  meController,
  signOutController,
} from "../../controllers/users/auth/index.js";

const router = express.Router();
router.post("/register", registerUserController);
router.get("/verifyPhoneNumber", verifyUserPhoneNumberController);
router.post("/verifyOTP", verifyUserOTPController);
router.get("/me", verifyUserJwtTokenMiddleware, meController);
router.get("/signOut", verifyUserJwtTokenMiddleware, signOutController);

export default router;
