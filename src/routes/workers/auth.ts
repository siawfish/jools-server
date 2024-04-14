import express from 'express';
import { registerController, verifyWorkerPhoneNumberController, verifyWorkerOTPController, verifyJwtTokenMiddleware, meController, signOutController } from '../../controllers/workers/auth/index.js';

const router = express.Router();
router.post('/register', registerController);
router.get('/verifyPhoneNumber', verifyWorkerPhoneNumberController);
router.post('/verifyOTP', verifyWorkerOTPController);
router.get('/me', verifyJwtTokenMiddleware, meController);
router.get('/signOut', verifyJwtTokenMiddleware, signOutController);


export default router;