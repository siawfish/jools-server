import express from "express";
import {
  createPortfolioController,
  getPortfolioByIdController,
  getWorkerPortfoliosController,
  updatePortfolioController,
  deletePortfolioController,
  likePortfolioController,
  getPortfolioCommentsController,
  commentOnPortfolioController,
} from "../../controllers/workers/portfolio/index";
import { verifyWorkerJwtTokenMiddleware } from "../../controllers/workers/auth/index";

const router = express.Router();
router.post("/", verifyWorkerJwtTokenMiddleware, createPortfolioController);
router.get("/:id", verifyWorkerJwtTokenMiddleware, getPortfolioByIdController);
router.get("/", verifyWorkerJwtTokenMiddleware, getWorkerPortfoliosController);
router.put("/:id", verifyWorkerJwtTokenMiddleware, updatePortfolioController);
router.delete("/:id", verifyWorkerJwtTokenMiddleware, deletePortfolioController);
router.post("/:id/like", verifyWorkerJwtTokenMiddleware, likePortfolioController);
router.post("/:id/comment", verifyWorkerJwtTokenMiddleware, commentOnPortfolioController);
router.get("/:id/comments", verifyWorkerJwtTokenMiddleware, getPortfolioCommentsController);

export default router;
