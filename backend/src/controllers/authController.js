import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// Correctly initialize the Google OAuth client
// These must be set in your Vercel environment variables
const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI, // e.g., 'https://your-app.vercel.app/api/auth/google'
});

/**
 * ============================
 * STANDARD REGISTRATION
 * ============================
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, degree_program, classification, student_number } =
      req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "tutee",
      degree_program,
      classification,
      student_number,
      email_verified: true,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ============================
 * STANDARD LOGIN
 * ============================
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user || !user.password) {
      throw new ApiError("Invalid email or password", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new ApiError("Invalid email or password", 401);
    }

    // Check Account Status
    if (user.status === 'suspended') {
      throw new ApiError("Your account has been suspended due to policy violations.", 403);
    }
    if (user.status === 'inactive') {
      throw new ApiError("This account is inactive.", 403);
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        isLRCAdmin: user.isLRCAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ============================================
 * GOOGLE LOGIN (AUTHORIZATION CODE FLOW)
 * ============================================
 * Handles the server-side exchange of the authorization code for tokens.
 */
export const googleLogin = async (req, res, next) => {
  try {
    // --- DEBUGGING LOG ---
    console.log("Auth Controller - Configured Redirect URI:", googleClient.redirectUri);
    // --- END DEBUGGING LOG ---
    
    const { code, degree_program, classification, student_number } = req.body;

    if (!code) {
      throw new ApiError("Google authorization code is required", 400);
    }

    // 1. EXCHANGE CODE FOR TOKENS
    const { tokens } = await googleClient.getToken(code);
    const idToken = tokens.id_token;

    if (!idToken) {
      throw new ApiError("Failed to retrieve ID token from Google", 500);
    }

    // 2. VERIFY THE ID TOKEN
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, sub: googleSub, picture, hd } = payload;

    // 3. ENFORCE UP MAIL DOMAIN
    if (hd !== "up.edu.ph" && !email.endsWith("@up.edu.ph")) {
      throw new ApiError("Access restricted: only @up.edu.ph accounts are allowed", 403);
    }

    // 4. FIND OR CREATE USER
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) { // Existing user
      let updated = false;
      if (!user.google_sub) { user.google_sub = googleSub; updated = true; }
      if (user.picture !== picture) { user.picture = picture; updated = true; }
      if (user.name !== name) { user.name = name; updated = true; }
      if (updated) await user.save();

      // Check Account Status
      if (user.status === 'suspended') throw new ApiError("Your account has been suspended due to policy violations.", 403);
      if (user.status === 'inactive') throw new ApiError("This account is inactive.", 403);
    } else { // New user
      if (!degree_program || !classification) {
        // This case is for when a user logs in for the first time without completing the form.
        // The frontend should have sent the user to an onboarding page first.
        return res.status(404).json({
          success: false,
          message: "User not onboarded",
          googleData: { email, name, picture, code }, // Send code back if needed
        });
      }

      user = await User.create({
        name,
        email: email.toLowerCase(),
        role: "tutee",
        google_sub: googleSub,
        picture,
        email_verified: true,
        degree_program,
        classification,
        student_number,
      });
    }

    // 5. ISSUE JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, isLRCAdmin: user.isLRCAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error("❌ Google Auth Error:", err);
    next(err);
  }
};


/**
 * ============================
 * CHECK USER EXISTENCE
 * ============================
 */
export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      throw new ApiError("Email is required", 400);
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    res.status(200).json({
      success: true,
      exists: !!user,
      user: user
        ? {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

