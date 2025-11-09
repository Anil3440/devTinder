const express = require('express');

const app = express();
//multiple route handlers(X) | multiple middlewares and one route handler which actuaally handles the route req(✓).
app.use("/user",(req,res,next)=>{
    console.log("Route handler 1");//middleware
    next();
    // res.send("response 1");//throws error since res is already send for req by url.
},(req,res)=>{
    console.log("Route handler 2");
    res.send("response from handler 2");//route handler
})//can add as many middlewares as we want but have to send res in the end.



app.listen(3440,()=>{
    console.log("server is currently listening on port 3440");
});