const Listing = require("./models/listing")
const Review = require("./models/review")

module.exports.isLoggedIn = (req, res, next) => { // jo hamara session hai passport ke help se user info ko save karta hai 
    if(!req.isAuthenticated()){    // check karta hai jo hamra current session usmai jo user hai vo logged in hai aagar nhi tab login karo phele
            req.session.redirectUrl = req.originalUrl
            req.flash("error", "you must be logged in to creat listings: ")
            return res.redirect("/login")
        }
    next()
}


// login hone se phele hi req.originalUrl ko session.redirectUrl mai store kar de rahe hai or ye session sare middleware or method mai hoge 
// ab jese ham login kara rahe hai vese hi passport session related info reset kar de raha hai isliy ham local mai save kar arahe hai session related 
// info ko 



module.exports.saveredirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){   // agar session.redirectUrl hai tab locals mai store kar do or is saveredirectUrl ko hame login hone se phele use 
        res.locals.redirectUrl = req.session.redirectUrl // karenge passport se phele ===> user.js
    }
    next()
}



module.exports.isOwner = async (req ,res, next) =>{    // for chek owner
    let {id} = req.params;
        let listings = await Listing.findById(id)
        if(!listings.owner.equals( res.locals.currUser._id)){
            req.flash("error", "you don't have permission to edit")
            return res.redirect(`/listings/${id}`)
        }
        next()
}


module.exports.isReviewAuthor = async (req ,res, next) =>{    // for chek owner
    let {id, reviewId} = req.params;
        let review = await Review.findById(reviewId)
        if(!review.author.equals( res.locals.currUser._id)){
            req.flash("error", "you are not the author of this review")
            return res.redirect(`/listings/${id}`)
        }
        next()
}