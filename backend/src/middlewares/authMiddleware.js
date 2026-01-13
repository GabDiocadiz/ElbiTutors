import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

            next();
        } catch (error) {
            console.error(error);
            const err = new Error('Not authorized, token failed');
            err.statusCode = 401;
            next(err);
        }
    }

    if (!token) {
        const error = new Error('Not authorized, no token');
        error.statusCode = 401;
        next(error);
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.isLRCAdmin)) {
        next();
    } else {
        const error = new Error('Not authorized as an admin');
        error.statusCode = 403;
        next(error);
    }
};

export const tutorOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'tutor' || req.user.role === 'admin' || req.user.isLRCAdmin)) {
        next();
    } else {
        const error = new Error('Not authorized as a tutor');
        error.statusCode = 403;
        next(error);
    }
};
