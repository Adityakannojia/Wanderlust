const express = require("express");
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/WrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../Schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const {isLoggedIn, isReviewAuthor} = require("../middleware.js")


// joi validation

let reviewValidation = (req, res, next) =>{
    console.log(req.body)
    let {error} = reviewSchema.validate(req.body, {convert: true})
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        console.log(errMsg)
        throw new ExpressError(400, errMsg)
    }else{
        next()
    }
}


const reviewController = require("../constrollers/review.js")

// add Review 
//post route
router.post("/", isLoggedIn, reviewValidation, wrapAsync(reviewController.createReview))


// Delete review Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router