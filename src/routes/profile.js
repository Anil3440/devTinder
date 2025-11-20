const express = require('express');
const profileRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const { User } = require('../models/user');
const {validateEditProfileData,validateEditPasswordData} = require('../utils/helper')

//view profile
profileRouter.get("/profile/view", userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("something went wrong"+err.message);
    }
});

//edit profile
profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    
    try{
        const loggedInUser = req.user;
        const data = req.body;
        if(!validateEditProfileData(req)){
            throw new Error("cannot update the given fields.");
        }
        Object.keys(data).forEach(key=>loggedInUser[key]=data[key]);
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile was updated successfully.`,
            data: loggedInUser
        });
    }
    catch(err){
        res.status(400).send("Update failed: " + err.message);
    }
});

//edit password
profileRouter.patch('/profile/password/update',userAuth,async (req,res)=>{
    try{
        const user = req.user;
        if(!validateEditPasswordData(req)){
            throw new Error("couldn't update password");
        }
        Object.keys(req.body).forEach(k=>user[k] = req.body[k]);
        // user[password] = req.data[password];
        await user.save();
        res.json({
            message: "password updated successfully",
            
        });
    }
    catch(err){
        res.status(400).send("Error occured: " + err.message);
    }
});

module.exports = profileRouter;