import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const register = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        
        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //Create user
        const user = await User.create({ email, password: hashedPassword, role });
        
        res.status(201).json({ success: true, message: "User registered" });
    } catch (err) {
        next(err); 
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            return next(error);
        }

        //Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, token });
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