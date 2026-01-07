const Review = require("../models/review")
const Listing = require("../models/listing.js")


module.exports.createReview = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review)     // create new review 
    newReview.author = req.user._id
    console.log(newReview);
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()


    req.flash("success", "New Review Created")
    res.redirect(`/listings/${id}`)
}


module.exports.destroyReview = async(req, res) =>{
    let {id, reviewId} = req.params
    console.log(reviewId)
    await Review.findByIdAndDelete(reviewId)    // Delete review

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})   // Delete review ref from listing also
    req.flash("success", "Review deleted")
    res.redirect(`/listings/${id}`)
}