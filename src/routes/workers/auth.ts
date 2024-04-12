import express from 'express';
import { registerController, verifyWorkerPhoneNumberController, verifyWorkerOTPController } from '../../controllers/workers/auth/index.js';

const router = express.Router();
router.post('/register', registerController);
router.get('/verifyPhoneNumber', verifyWorkerPhoneNumberController);
router.post('/verifyOTP', verifyWorkerOTPController);


export default router;