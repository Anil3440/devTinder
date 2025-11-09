const mongoose = require('mongoose');
const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://Mikey:vH9K3ka8260vuQWR@stella.tga7o9y.mongodb.net/devTinder");
};
module.exports = {connectDB,};
