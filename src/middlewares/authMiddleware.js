const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Authorization token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // <-- Add this line
        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new ApiError(401, 'Token expired. Please log in again.');
        }
        if (err.name === 'JsonWebTokenError') {
            throw new ApiError(401, 'Invalid token. Authentication failed.');
        }
        throw new ApiError(401, 'Could not authenticate user.');
    }
});

const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new ApiError(401, 'User role information missing in token.');
        }

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, 'You do not have permission to perform this action.');
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    roleMiddleware
};
