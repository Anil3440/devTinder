const express = require('express');
const {User} = require('../models/user');
const {validateSignup} = require('../utils/helper');
// const bcrypt = require('bcrypt');
const validator = require('validator');

const authRouter = express.Router();

//signup API
authRouter.post("/signup",async (req,res)=>{
     
    try{
        //validating req.body using helper method.
        validateSignup(req);

        //creating new instance of 'User' model
        const user = new User(req.body);
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        if(err.code===11000){
            if(err.keyPattern&&err.keyPattern.emailId){
                return res.status(409).send("This email address is already registered.");
            }
        }
        if(err.name === 'ValidationError'){
            return res.status(400).send("Validation Error: "+ err.message);
        }
        res.status(500).send("ERROR: "+err.message);
    }
    
});

//login API
authRouter.post("/login",async(req,res)=>{
    try{
        req.body.emailId = validator.normalizeEmail(req.body.emailId);
        const{emailId,password} = req.body;
        //validate email id
        if(!validator.isEmail(emailId)){
            throw new Error("enter a valid email id");
        }
        
         //check for the email in DB
        const user = await User.findOne({emailId:emailId}).select('+password');
        if(!user){
            throw new Error("Invalid credentials.");
        }
        //compare the password
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //create a token
            const token = await user.getJWT();
            //send cookie
            res.cookie("token",token,{expires: new Date(Date.now() + 1 * 3600000)});
            res.send("login successfull!!");
        }else{
            throw new Error("Invalid credentials.");
        }
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

//logout API
authRouter.post('/logout',async(req,res)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
    })
    .send("logged out successfully");
});

module.exports = authRouter;