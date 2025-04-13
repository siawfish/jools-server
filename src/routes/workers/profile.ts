import express from "express";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index";
import { updateWorkerProfileController } from "../../controllers/workers/profile";

const router = express.Router();
router.patch("/", verifyWorkerJwtTokenMiddleware, updateWorkerProfileController);

export default router;
