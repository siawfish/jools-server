import express from "express";
import { verifyUserJwtTokenMiddleware } from "../../controllers/users/auth";
import { deleteUserController, getUserController, updatePushTokenController, updateUserController } from "../../controllers/users/profile";

const router = express.Router();
router.get("/profile/:id", verifyUserJwtTokenMiddleware, getUserController);
router.patch("/profile", verifyUserJwtTokenMiddleware, updateUserController);
router.delete("/profile", verifyUserJwtTokenMiddleware, deleteUserController);
router.post("/update-push-token", verifyUserJwtTokenMiddleware, updatePushTokenController);

export default router;
