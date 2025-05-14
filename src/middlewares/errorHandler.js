const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.isJoi) {
        // Get the first validation error message
        const firstError = err.details[0].message;
        return res.status(400).json({
            status: false,
            message: firstError
        });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: false,
            message: err.message
        });
    }

    res.status(500).json({
        status: false,
        message: 'Internal Server Error'
    });
};

module.exports = errorHandler;
