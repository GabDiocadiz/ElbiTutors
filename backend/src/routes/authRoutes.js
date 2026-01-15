import express from 'express';
import { register, login, googleLogin, checkUser } from '../controllers/authController.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, googleLoginSchema } from '../validation/authSchema.js';

const router = express.Router();

// User Registration
router.post('/register', validateBody(registerSchema), register);

// User Login (Standard)
router.post('/login', validateBody(loginSchema), login);

// User Login (Google)
router.post('/google', validateBody(googleLoginSchema), googleLogin);

// Check if user exists
router.get('/check-user', checkUser);

export default router;