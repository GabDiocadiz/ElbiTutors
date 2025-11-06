// routes/authRoutes.js

import express from "express";

const router = express.Router();

/**
 *  GET /auth/login
 *  Public
 */
router.get("/login", oauthLogin);

/**
 * GET /auth/callback
 * Public
 */
router.get("/callback", oauthCallback);

/**
 * POST /auth/logout
 * Authenticated users
 */
router.post("/logout", logoutUser);

/**
 * GET /auth/me
 * Frontend calls this to check if user is logged in and to get their info
 * Authenticated users
 */
router.get("/me", getCurrentUser);

export default router;
