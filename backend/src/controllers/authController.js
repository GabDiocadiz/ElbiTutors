const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); 

exports.register = async (req, res, next) => {
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

exports.login = async (req, res, next) => {
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