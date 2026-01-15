import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Middleware to protect routes. Verifies JWT token from Authorization header.
 * @srs     5.3 Security Requirements: Access Control
 */
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token, exclude password
            req.user = await User.findById(decoded.id || decoded._id).select('-password');
            
            if (!req.user) {
                const error = new Error('Not authorized, user not found');
                error.statusCode = 401;
                return next(error);
            }

            // SRS Security Check: Enforce Suspension
            if (req.user.status === 'suspended') {
                const error = new Error('Your account has been suspended due to policy violations.');
                error.statusCode = 403;
                return next(error);
            }
            if (req.user.status === 'inactive') {
                const error = new Error('Account is inactive.');
                error.statusCode = 403;
                return next(error);
            }

            return next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            const err = new Error('Not authorized, token failed');
            err.statusCode = 401;
            return next(err);
        }
    }

    if (!token) {
        const error = new Error('Not authorized, no token');
        error.statusCode = 401;
        return next(error);
    }
};

/**
 * @desc    Middleware to restrict access to Admins only.
 * @srs     2.3 User Classes: Admins (LRC Staff)
 */
export const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.isLRCAdmin)) {
        next();
    } else {
        const error = new Error('Not authorized as an admin');
        error.statusCode = 403;
        next(error);
    }
};

/**
 * @desc    Middleware to restrict access to Tutors (and Admins).
 * @srs     2.3 User Classes: LRC-Trained Tutors
 */
export const tutorOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'tutor' || req.user.role === 'admin' || req.user.isLRCAdmin)) {
        next();
    } else {
        const error = new Error('Not authorized as a tutor');
        error.statusCode = 403;
        next(error);
    }
};

/**
 * @desc    Factory for granular permission checks (SRS 4.2.3 REQ-5)
 * @param   {string} permission - The key in user.permissions (e.g., 'verifyTutors')
 */
export const hasPermission = (permission) => {
    return (req, res, next) => {
        // Super admins (developers) or full admins override granular checks? 
        // For now, let's assume 'role: admin' implies ALL permissions, 
        // OR we strictly check the flag. Let's start with strict check + super admin override.
        const isSuperAdmin = req.user.role === 'admin'; 
        const hasFlag = req.user.permissions && req.user.permissions[permission] === true;
        
        if (isSuperAdmin || hasFlag) {
            next();
        } else {
            const error = new Error(`Not authorized: Missing '${permission}' permission.`);
            error.statusCode = 403;
            next(error);
        }
    };
};
