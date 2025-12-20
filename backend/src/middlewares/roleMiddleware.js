const roleMiddleware = (...allowedRoles) => {
    return (req,res,next) =>{
        if (!req.user || !req.user.role){
            const error = new Error('Access denied. No role found.');
            error.statusCode = 403; //Forbidden
            return next(error);
        }

        const hasRole = allowedRoles.includes(req.user.role);

        if(!hasRole){
            const error = new Error('Access denied. Insufficient permissions.');
            error.statusCode = 403; //Forbidden
            return next(error);
        }

        next();
    };

};

module.exports = roleMiddleware;