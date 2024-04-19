"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_js_1 = require("../../controllers/workers/auth/index.js");
const index_js_2 = require("../../controllers/workers/profile/index.js");
const router = express_1.default.Router();
router.get("/profile/:id", index_js_1.verifyWorkerJwtTokenMiddleware, index_js_2.getWorkerController);
router.patch("/profile/:id", index_js_1.verifyWorkerJwtTokenMiddleware, index_js_2.updateWorkerController);
router.delete("/profile", index_js_1.verifyWorkerJwtTokenMiddleware, index_js_2.deleteWorkerController);
exports.default = router;
