const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js")
const flash = require("connect-flash")
const {isLoggedIn} = require("../middleware.js")
const {isOwner} = require("../middleware.js")



const listingController = require("../constrollers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    console.log(req.body)
    if(error){  
    let errMsg = error.details.map((el) => el.message).join(",")   // return detail message combine 
    throw new ExpressError(400, errMsg)
    }else{
        next()
    }
}

// router.route

router.route("/")
.get(wrapAsync(listingController.index)) // index route
.post(isLoggedIn, validateListing, upload.single('listing[image]'),wrapAsync(listingController.createListing)) // create route



// New route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingController.showListng)) // show route => specific
.put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)) // Update route
.delete(isLoggedIn ,isOwner,wrapAsync(listingController.destroyListing))




// edit route
router.get("/:id/edit", isLoggedIn ,isOwner, wrapAsync(listingController.renderEditForm))







module.exports = router


