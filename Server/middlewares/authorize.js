const CustomError = require("../utils/customError");

// Implementing authorization based on role
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError("Access denied" , 403);
        }
        next();
    };
};

module.exports = authorize;