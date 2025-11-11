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
})
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
})
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
})
//update data of the user
app.patch("/user",async(req,res)=>{
    const userId = req.body._id;
    const data = req.body;
    try{
        const user = await User.findByIdAndUpdate(userId,data,{returnDocument: "after"});
        console.log(user);
        res.send("user data updated successfully");
    }
    catch(err){
        res.send("something went wrong");
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

