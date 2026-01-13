import express from 'express';
import { googleLogin } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/google
// @desc    Login/Register via Google Token
router.post('/google', googleLogin);

export default router;