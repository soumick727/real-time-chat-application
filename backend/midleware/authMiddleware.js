const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token is missing",
                success: false
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
        
        // Find the user by ID from the decoded token
        const user = await User.findById(decoded.id).select("-password -__v");
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Attach user to request object
        req.user = user;
        
        next();
    }catch(error) {
        console.error("Error in verifyToken:", error);
        return res.status(401).json({
            message: "Unauthorized access",
            success: false
        });
    }
}
