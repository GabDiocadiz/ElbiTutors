import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/**
 * IMPORTANT:
 * This client ID MUST MATCH the frontend GoogleLogin client_id
 */
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;                                                 

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

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
 * ============================
 * GOOGLE LOGIN (ID TOKEN FLOW)
 * ============================
 * Accepts:
 *  - credential (Google Identity Services)
 *  - idToken (fallback)
 */
export const googleLogin = async (req, res, next) => {
  try {
    const idToken = req.body.credential || req.body.idToken;

    const { degree_program, classification, student_number } = req.body;

    if (!idToken) {
      console.error("❌ Missing Google ID token:", req.body);
      throw new ApiError("Google ID token is required", 400);
    }

    /**
     * 1. VERIFY GOOGLE ID TOKEN
     */
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      email,
      name,
      sub: googleSub,
      picture,
      hd,
    } = payload;

    /**
     * 2. ENFORCE UP MAIL DOMAIN
     */
    if (hd !== "up.edu.ph" && !email.endsWith("@up.edu.ph")) {
      throw new ApiError(
        "Access restricted: only @up.edu.ph accounts are allowed",
        403
      );
    }

    /**
     * 3. FIND OR CREATE USER
     */
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      let updated = false;

      if (!user.google_sub) {
        user.google_sub = googleSub;
        updated = true;
      }

      if (user.picture !== picture) {
        user.picture = picture;
        updated = true;
      }

      if (user.name !== name) {
        user.name = name; // sync full name from Google
        updated = true;
      }

      if (updated) await user.save();

      // Check Account Status
      if (user.status === 'suspended') {
        throw new ApiError("Your account has been suspended due to policy violations.", 403);
      }
      if (user.status === 'inactive') {
        throw new ApiError("This account is inactive.", 403);
      }
    }
    else {
      /**
       * If onboarding data missing → frontend should handle this
       */
      if (!degree_program || !classification) {
        return res.status(404).json({
          success: false,
          message: "User not onboarded",
          googleData: { email, name, picture },
        });
      }


      user = await User.create({
        name,
        email: email.toLowerCase(),
        role: "tutee",
        google_sub: googleSub,
        picture,
        email_verified: true,
        degree_program: degree_program || "Not set",
        classification: classification || "Not set",
        student_number: student_number || "Not set",
      });

    }

    /**
     * 4. ISSUE JWT
     */
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
    console.error("❌ Google Auth Error:", err.message);
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
