const CustomError = require("../utils/customError");
const { verifyToken } = require("../utils/jwt");

// Authentication middleware for providers
const providerAuth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log("toke", token)
        if (!token) {
            throw new CustomError("No token, authorization denied", 401);
        }
        const decoded = verifyToken(token);
        console.log("decoded",decoded);
        if (decoded.role === "Provider") {
            req.user = decoded;
            next();
        } else {
            throw new CustomError("Unauthorized access", 403);
        }
    } catch (error) {
        next(new CustomError(error.message || "Authentication failed", 401));
    }
};

module.exports = providerAuth;
