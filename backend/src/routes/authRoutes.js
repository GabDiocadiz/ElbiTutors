import express from 'express';
// import { register, login } from '../controllers/authController.js';
import { 
  register, 
  login, 
  googleLogin, 
  checkUser 
} from '../controllers/authController.js';
// import validateBody from '../middlewares/validateBody.js';
// Assume you have Joi schemas defined in src/validation/authValidation.js
// import { registerSchema, loginSchema } from '../validation/authValidation.js';

const router = express.Router();

// User Registration: POST /api/auth/register
// router.post('/register', validateBody(registerSchema), register);
router.post('/register', register);

// User Login: POST /api/auth/login
// router.post('/login', validateBody(loginSchema), login);
router.post('/login', login);

// User Login (Google)
router.post('/google', googleLogin);

// Check if user exists: GET /api/auth/check-user
router.get('/check-user', checkUser);

export default router;