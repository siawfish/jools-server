import express from "express";
import { reverseGeoCodeController } from "../../controllers/google";

const router = express.Router();
router.get("/reverseGeoCode/:latlng", reverseGeoCodeController);

export default router;
