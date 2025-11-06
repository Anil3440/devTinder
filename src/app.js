const express = require('express');

const app = express();

app.use("/test",(req,res)=>{
    res.send("welcome to test page!)");
});

app.use("/",(req,res)=>{
    res.send("welcome to home page!)");
});

app.use("/result",(req,res)=>{
    res.send("welcome to result page!)");
});

app.listen(3440,()=>{
    console.log("server is currently listening on port 3440");
});