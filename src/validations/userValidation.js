const Joi = require('joi');

const userValidate = Joi.object({
    firstName: Joi.string().min(2).max(30).optional().messages({
        'string.empty': 'First name is optional',
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must be at most 30 characters long',
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().min(2).max(30).optional().messages({
        'string.empty': 'Last name is optional',
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must be at most 30 characters long',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(20).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password must be at most 20 characters long',
        'any.required': 'Password is required'
    }),
});

module.exports = userValidate;
