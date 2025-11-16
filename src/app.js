const express = require('express');
const {connectDB} = require('./config/database');
const {User} = require('./models/user');
const {validateSignup} = require('./utils/helper');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());//using an express inbuilt middleware to convert JSON to js object to see on    console

app.post("/signup",async (req,res)=>{
     
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
// fetch user info using email
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({emailId:userEmail});
        if(users.length===0){
            res.status(400).send("no user found");
        }else{
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("something went wrong"+err.message);
    }

});
//feed API - GET /feed - get all of the users from the database
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({});
        if(users.length===0){
            res.send("no users to show");
        }else{
            res.send(users);
        }
    }
    catch(err){
        res.send("something went wrong");
    }
});
//findOne API - GET /find - get one object from DB.
app.get("/find",async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({
            emailId: userEmail,
            age: {$gte: 21}
        });
        res.send(user);
        // if(!user){
        //     res.send("no data found");
        // }
        // else{
        //     res.send(user);
        // }
    }
    catch(err){
        res.send("something went wrong");
    }
});
//delete user from DB
app.delete("/user",async(req,res)=>{
    const userId = req.body._id;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted successfully");
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
});
//update data of the user
app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ['password','gender','photoUrl','about','skills'];
        const isAllowed = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isAllowed){
            throw new Error("update not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("can't add more than 10 skills");
        }
        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("user data updated successfully");
    }
    catch(err){
        res.send("Update Failed: "+err.message);
    }
});

connectDB()
    .then(()=>{
        console.log("connected to db successfully");
        app.listen(3440,()=>{
            console.log("server is currently listening on port 3440");
        });
    })
    .catch((err)=>{
        console.error("error connecting to db");
    });

