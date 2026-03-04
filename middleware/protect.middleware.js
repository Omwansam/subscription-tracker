// This middleware protects routes that require authentication
// It verifies the JWT token and attaches the user information to the request object
// Example usage: app.get('/api/v1/user/profile', protect, getProfile);

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    try {
        let token;


        //Extract token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.token) {
            token = req.cookies.token;
        }

        // if no token is found, return unauthorized
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        // Find user by ID from token payload
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        // Attach user to request object
        req.user = user;
        next();

    }catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token expired . Please log in again",
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token",
            });
        }
        next(error);
    }
}

module.exports = protect;