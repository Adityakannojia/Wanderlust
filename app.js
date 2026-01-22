if(process.env.NODE_ENV != "production"){
require('dotenv').config()
}



const express = require("express");
const path = require("path")
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo').default
const flash = require("connect-flash")
const passport = require("passport")       // Auntantication
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


// routers
const listingsRouter = require("./routes/listings.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const dbUrl = process.env.ATLASEDB_URL   // Atlase database

async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then((res) =>{
    console.log("connection successful: ");
})
.catch((err) =>{
    console.log(err)
})


app.engine("ejs", ejsMate)
app.use(methodOverride('_method'))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))


const store = MongoStore.create({  // mongo session store
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600    // store session when refresh 
});

store.on("error", ()=>{
    console.log("Error in MONGO SESSION STORE: ")
})

// express session
const sessionOption = {
    store,               
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



// express session
app.use(session(sessionOption))   
app.use(flash())



// possport for auntenctication
app.use(passport.initialize())   // use session next
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))    // login and signup

passport.serializeUser(User.serializeUser());   // user related store in session
passport.deserializeUser(User.deserializeUser()); // unstore when end the session



// flash middlewar
app.use((req, res, next) =>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})


// demo

// app.get("/demo", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     })

//     let registerUser = await User.register(fakeUser, "helloworld")   //static
//     res.send(registerUser)
// })


// express.Route
app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)


// Error Handler

app.all("", (req, res) =>{
    throw new ExpressError(400, "page not found")
})

app.use((err, req, res, next) => {
    let {status = 500, message = "something went error"} = err
    console.log(err)
    res.status(status).render("error.ejs", {err})
})


app.listen(8080, () =>{
    console.log("Listening on port 8080");
})