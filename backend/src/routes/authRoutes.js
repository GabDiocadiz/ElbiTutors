const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateBody = require('../middlewares/validateBody');
// Assume you have Joi schemas defined in src/validation/authValidation.js
const { registerSchema, loginSchema } = require('../validation/authValidation');

// User Registration: POST /api/auth/register
router.post('/register', validateBody(registerSchema), authController.register);

// User Login: POST /api/auth/login
router.post('/login', validateBody(loginSchema), authController.login);

module.exports = router;