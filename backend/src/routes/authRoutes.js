import express from 'express';
import { register, login, googleLogin, checkUser } from '../controllers/authController.js';

const router = express.Router();

// User Registration
router.post('/register', register);

// User Login (Standard)
router.post('/login', login);

// User Login (Google) - This was missing or not imported correctly!
router.post('/google', googleLogin);

// Check if user exists
router.get('/check-user', checkUser);

export default router;