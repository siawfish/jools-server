import express from "express";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index.js";
import { uploadFilesController } from "../../controllers/workers/files/index.js";

const router = express.Router();
router.post("/upload", verifyWorkerJwtTokenMiddleware, uploadFilesController);

export default router;
