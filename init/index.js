const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js")

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
.then((res) =>{
    console.log("connection successful: ");
})
.catch((err) =>{
    console.log(err);
})

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({...obj, owner: '69551377d4a53d2e381abdf2', geometry: {type: 'Point', coordinates: [-106.8175, 39.1911]}})) // new array   // har ek indiviual object mai ek new propertie add kar dega
    await Listing.insertMany(initData.data)  //initData obj .  key data access
    console.log("data was initialized");
}

initDB()