const express = require('express');
const {connectDB} = require('./config/database');
const {User} = require('./models/user');

const app = express();
app.use(express.json());//using an express inbuilt middleware to convert JSON to js object to see on    console

app.post("/signup",async (req,res)=>{
    //creating new instance of 'User' model
    const user1 = new User(req.body);
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

