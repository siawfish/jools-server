import express from "express";
import {
  createPortfolioController,
  getPortfolioByIdController,
  getWorkerPortfoliosController,
  updatePortfolioController,
  deletePortfolioController,
} from "../../controllers/workers/portfolio/index";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index";

const router = express.Router();
router.post("/", verifyWorkerJwtTokenMiddleware, createPortfolioController);
router.get("/:id", verifyWorkerJwtTokenMiddleware, getPortfolioByIdController);
router.get("/", verifyWorkerJwtTokenMiddleware, getWorkerPortfoliosController);
router.put("/:id", verifyWorkerJwtTokenMiddleware, updatePortfolioController);
router.delete("/:id", verifyWorkerJwtTokenMiddleware, deletePortfolioController);

export default router;
