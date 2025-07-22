// schema.js

// CORRECT WAY TO IMPORT JOI: Assign it to a variable, usually 'Joi'
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        country : Joi.string().required(),
        price: Joi.number().required().min(0),
        image : Joi.string().allow("" , null), // Corrected Joi.Sting to Joi.string
        location: Joi.string().required(),
    }).required()
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // Added min/max based on your Mongoose schema
        comment : Joi.string().required(),
    }).required()
});