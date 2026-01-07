const mongoose = require("mongoose")
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema = new Schema({    
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose); // passportlocalmonggose automatically add username , password, hashing , salting and methods
let User = mongoose.model("User", userSchema)


module.exports = User


