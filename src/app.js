const express = require('express');

const app = express();
//multiple route handlers
app.use("/user",(req,res,next)=>{
    console.log("Route handler 1");
    next();
    // res.send("response 1");//throws error since res is already send for req by url.
},(req,res)=>{
    console.log("Route handler 2");
    res.send("response from handler 2");
})//can add as many route handlers as we want but have to send res in the end.



app.listen(3440,()=>{
    console.log("server is currently listening on port 3440");
});