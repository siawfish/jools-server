import express from "express";
import { verifyUserJwtTokenMiddleware } from "../../controllers/users/auth";
import { searchController } from "../../controllers/users/search";

const router = express.Router();
router.get("/search", verifyUserJwtTokenMiddleware, searchController);

export default router;
