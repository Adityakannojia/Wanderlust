const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/WrapAsync");
const passport = require("passport")
const {saveredirectUrl} = require("../middleware.js")


const userController = require("../constrollers/users.js")


// router.route
router.route("/signup")
.get(userController.randerSignupForm)
.post(wrapAsync(userController.signup))



router.route("/login")
.get((req, res) =>{
    res.render("users/login.ejs")
})
.post(saveredirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.login)
// jese hai passport login ke liye authenticate karega vese session relate info locals mai save ho jaye or redirect ho jayega locals.redirectUrl pe



// logout user
router.get("/logout", userController.logout)




module.exports = router