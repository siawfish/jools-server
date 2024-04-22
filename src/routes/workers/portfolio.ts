import express from "express";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index.js";
import { createPortfolioController } from "../../controllers/workers/portfolio/index.js";

const router = express.Router();
router.post("/portfolio", verifyWorkerJwtTokenMiddleware, createPortfolioController);

export default router;
