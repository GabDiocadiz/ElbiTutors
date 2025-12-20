const validateBody = (schema) =>{
    return(req,res,next)=>{
        
        const{error} = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: true
        });

        if (error){
            const errorMessage = error.details
                .map((detail) => detail.message.replace(/"/g, ''))
                .join(', ');

            const customError = new Error(errorMessage);
            customError.statusCode = 400; // Bad Request
            return next(customError);
        }

        next();
    };
};

module.exports = validateBody;