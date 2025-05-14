const Joi= require('joi');
const eventValidate = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required'
    }),
    date: Joi.date().required().messages({
        'date.base': 'Date must be a valid date',
        'any.required': 'Date is required'
    }),
    location: Joi.string().required().messages({
        'string.empty': 'Location is required',
        'any.required': 'Location is required'
    }),
    ticketPrice: Joi.number().required().messages({
        'number.base': 'Ticket price must be a number',
        'any.required': 'Ticket price is required'
    }),
    capacity: Joi.number().required().messages({
        'number.base': 'Capacity must be a number',
        'any.required': 'Capacity is required'
    })
});
module.exports = eventValidate;