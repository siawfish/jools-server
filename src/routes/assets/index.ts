import express from "express";
import {
  uploadAssetsController,
  deleteAssetsController,
} from "../../controllers/assets/index";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index";

const router = express.Router();
router.post("/", uploadAssetsController);
router.delete("/", verifyWorkerJwtTokenMiddleware, deleteAssetsController);

export default router;
