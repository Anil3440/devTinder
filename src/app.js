const express = require('express');

const app = express();

app.use("/getUserData",(req,res,next)=>{
    try{
        //get data from db and send it
        throw new Error("random error");//throws random bs error which makes cluttered response
    }
    catch(err){
        res.status(500).send("error occured,contact customer support team.");
        res.send("user profile shown");
    }
    
})
app.use("/",(err,req,res,next)=>{//order matters while passing parameters (req,res)/(req,res,next)/
// (err,req,res,next)
    //can log the error for us to know.
    if(err){
        res.status(500).send("something went wrong");//using this error handler to give a simple error response to user for all errors.its called directly when error occurs or we can call using next(err) in any previous route handler/middleware.
    }
})

app.listen(3440,()=>{
    console.log("server is currently listening on port 3440");
});