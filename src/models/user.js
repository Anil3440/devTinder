const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"firstName is required"],
        minLength: 2,
        maxLength: 50,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [8,"password must have atleast 8 characters."],
        select: false,// <-- ADDED: Hides password from queries by default like User.findOne().
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter a strong password: ");
            }
        }
    },
    age: {
        type: Number,
        min: [18,"you must be above 18 to signup"],
        max: [120,"enter a valid age"],
        validate: { // <-- ADDED: Ensures age is an integer(Validator object)
            validator: Number.isInteger,//validator using built in function isInteger
            message: "{VALUE} is not an integer"//err message
        }
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // match: [/^\S+@\S+\.\S+$/,"enter a valid email"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: "+value);
            }
        }
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){//direct validate function
                throw new Error("invalid gender entered");
            }
        },
        lowercase: true,
        trim: true,
    },
    photoUrl: {
        type: String,
        trim: true,
        default: 'https://i.stack.imgur.com/34AD2.jpg',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid photo url: "+value);
            }
        }
    },
    about: {
        type: String,
        trim: true,
        default: "default about(description) of the user"
    },
    skills: {
        type: [String],
        // validate: { // This is the validator object
        // validator: function(arr) { // 1. The validator (as an inline function)
        //     return arr.every(skill => typeof skill === 'string' && skill.trim().length > 0);
        // },
        // message: 'Skills array must contain non-empty strings.' // 2. The message
        // }
    },
    role: {
        type: String,
        enum: {
            values: ["user","admin","moderator"],
            message: "{VALUE} is not valid(user, admin, or moderator)",
        },
        
        default: 'user',
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //     immutable: true,
    // },
},
{
    timestamps: true,
});
userSchema.pre('save',async function(next){
    const user = this;

    //only hash the password if its new or got modified
    if(!user.isModified('password')){
        return next();
    }
    try{
        //generate salt
        const salt = await bcrypt.genSalt(10);
        //generate hash
        user.password = await bcrypt.hash(user.password,salt);
        //continue with the save operation
        next();
    }catch(err){
        next(err);
    }
});
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id},"secretKey@40",{expiresIn: "1h"});
    return token;
};
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const hashPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,hashPassword);
    return isPasswordValid;
};
const User = mongoose.model("User",userSchema);
module.exports = {User}