const CustomError = require("../utils/customError");
const { verifyToken } = require("../utils/jwt");

// Authentication middleware for users
const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new CustomError("No token, authorization denied", 401);
        }

        const decoded = verifyToken(token);
        if (decoded.role === "User") {
            req.user = decoded;
            next();
        } else {
            throw new CustomError("Unauthorized access", 403);
        }
    } catch (error) {
        next(new CustomError(error.message || "Authentication failed", 401));
    }
};

module.exports = auth;
