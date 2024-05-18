import express from "express";
import { verifyUserJwtTokenMiddleware } from "../../controllers/users/auth/index.js";
import { uploadFilesController } from "../../controllers/users/files/index.js";

const router = express.Router();
router.post("/upload", verifyUserJwtTokenMiddleware, uploadFilesController);

export default router;
