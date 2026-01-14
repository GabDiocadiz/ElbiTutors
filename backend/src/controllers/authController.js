import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Tutor from '../models/Tutor.js';
import ApiError from '../utils/ApiError.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @desc    Authenticate User via Google OAuth Token
 * @route   POST /api/auth/google
 * @access  Public
 * @srs     3.1 User Authentication: "strict identity verification via UPMail"
 * @srs     5.3 Security Requirements: "Google OAuth against the user's UPMail"
 */
export const googleLogin = async (req, res, next) => {
    try {
        const { googleToken } = req.body;

        if (!googleToken) {
            throw new ApiError('Google token is required', 400);
        }

        // 1. Verify Google Token
        // NOTE: In production, clientID must be verified. 
        // For development/mocking, we trust the payload if verified.
        let ticket;
        let payload;

        try {
             ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID, 
            });
            payload = ticket.getPayload();
        } catch (verifyError) {
             // FALLBACK FOR MOCK/TESTING (If configured)
             if (process.env.NODE_ENV === 'development' && googleToken.startsWith('mock_')) {
                 console.log("Using Mock Token for Development");
                 payload = {
                     email: "mock_student@up.edu.ph",
                     name: "Mock Student",
                     sub: "mock_google_id_123",
                     picture: "https://example.com/pic.jpg",
                     hd: "up.edu.ph"
                 };
             } else {
                 throw new ApiError('Invalid Google Token', 401);
             }
        }

        const { email, name, sub, picture, hd } = payload;

        // 2. Enforce @up.edu.ph Domain (SRS 5.3)
        // 'hd' (hosted domain) claim usually present for GSuite emails
        if (hd !== 'up.edu.ph' && !email.endsWith('@up.edu.ph')) {
            throw new ApiError('Access Restricted: Only @up.edu.ph emails are allowed.', 403);
        }

        // 3. Find or Create User
        let user = await User.findOne({ email });

        if (user) {
            // Update existing user metadata if needed
            if (!user.google_sub) {
                user.google_sub = sub;
                user.picture = picture;
                await user.save();
            }
        } else {
            // Register new Tutee
            user = await User.create({
                name,
                email,
                role: 'tutee', // Default Role
                google_sub: sub,
                picture,
                email_verified: true,
                degree_program: '', // To be filled in Profile
                classification: ''
            });
        }

        // 4. Generate JWT for our API
        const token = jwt.sign(
            { id: user._id, role: user.role, isLRCAdmin: user.isLRCAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
            }
        });

    } catch (err) {
        next(err);
    }
};

// --- 3. GOOGLE LOGIN (For "Login with UP Mail") ---
export const googleLogin = async (req, res, next) => {
  try {
    const { 
      email, googleId, name, picture, 
      degree_program, classification
      // Removed 'role' from input because self-registration is ALWAYS 'tutee'
    } = req.body; 

    let user = await User.findOne({ email });

    if (!user) {
      // SCENARIO 1: New User Registration (Tutee Only)
      if (degree_program && classification) {
        user = await User.create({
          name,
          email,
          google_sub: googleId,
          picture,
          degree_program,
          classification,
          role: 'tutee', // FORCE ROLE TO TUTEE
          email_verified: true
        });
      } else {
        // SCENARIO 2: Frontend asking "Does this user exist?"
        // Return 404 to trigger Onboarding Flow
        return res.status(404).json({ message: "User not found" });
      }
    }

    // SCENARIO 3: Existing User (Tutee OR Pre-created Tutor)
    // Update Sync
    if (!user.google_sub) user.google_sub = googleId;
    if (!user.picture) user.picture = picture;
    await user.save();

    // Generate Token
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );

    res.status(200).json({ 
        success: true, 
        token, 
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            picture: user.picture
        }
    });
  } catch (err) {
    next(err);
  }
};

export const checkUser = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      return next(error);
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });

    res.status(200).json({ 
      success: true, 
      exists: !!user,
      user: user ? {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } : null
    });
  } catch (err) {
    next(err);
  }
};