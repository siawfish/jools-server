import express from "express";
import { verifyUserJwtTokenMiddleware } from "../../controllers/users/auth/index.js";
import { createBookingController } from "../../controllers/users/bookings/index.js";

const router = express.Router();
router.post("/booking", verifyUserJwtTokenMiddleware, createBookingController);

export default router;
