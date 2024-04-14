"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_js_1 = require("../../controllers/workers/auth/index.js");
const router = express_1.default.Router();
router.post('/register', index_js_1.registerController);
router.get('/verifyPhoneNumber', index_js_1.verifyWorkerPhoneNumberController);
router.post('/verifyOTP', index_js_1.verifyWorkerOTPController);
router.get('/me', index_js_1.verifyJwtTokenMiddleware, index_js_1.meController);
router.get('/signOut', index_js_1.verifyJwtTokenMiddleware, index_js_1.signOutController);
exports.default = router;
