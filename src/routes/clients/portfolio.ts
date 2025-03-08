import express from "express";
import { verifyClientJwtTokenMiddleware } from "../../controllers/clients/auth";
import { getPortfolioByIdController } from "../../controllers/clients/portfolio";

const router = express.Router();
router.get("/:id", verifyClientJwtTokenMiddleware, getPortfolioByIdController);

export default router;
