const jwt = require('jsonwebtoken');
const multer = require('multer');
const { storage, fileFilter } = require('./uploadMiddleware');
// const config = require('config');

// module.exports = function (req,res,next){
//     const token = req.header('x-auth-token');
//     if(!token) return res.status(401).send('Access denied. No token provided');

//     try{
//         const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
//         req.user = decoded;
//         next();
//     }
//     catch(ex){
//         res.status(400).send('Invalid token.');
//     }
// }

module.exports = function(req,res,next){
    const token = req.header('x-auth-token');

    if(!token){
        const error = new Error('Access denied. No token provided.');
        error.statusCode = 401;
        return next(error); // Sends to errorMiddleware
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET || 'your_fallback_secret');
        req.user = decoded;
        next();
    }
    catch{
        const error = new Error('Invalid token.');
        error.statusCode = 400;
        next(error);
    }
};
const upload = multer({
    storage: storage,
    limits: { filesize: 5 * 1024 * 1024 }, //5MB limit
    fileFilter: fileFilter,
});
exports.upload = upload;
