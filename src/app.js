const express = require('express');
const {connectDB} = require('./config/database');
const {User} = require('./models/user');

const app = express();
app.post("/signup",async (req,res)=>{
    //creating new instance of 'User' model
    const user1 = new User({
        firstName: "Anil",
        lastName: "Choudhary",
        emailId: "anil40@gmail.com",
        password: "anil@123",
        age: 21,
        gender: "Male",
    });
    try{
        await user1.save();
        res.send("User added successfully");
    }
    catch(err){
        res.send("error saving the user"+err.message);
    }
    
})

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

