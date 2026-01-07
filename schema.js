const joi = require("joi");    // server side validation schema

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required(),
        image: joi.object({
            filename: joi.string().allow("", null),
            url: joi.string().allow("", null)
        }).allow("", null)
    }).required()
})


module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required().strict(false),
        comment: joi.string().required()
    }).required()
})