const express = require('express');
const {adminAuth,userAuth} = require("./middlewares/adminAuth.js");
const app = express();

//handling auth middleware for all requests GET,POST,DELETE,PATCH,PUT by using app.use();
//actual use of middleware if writing single authentication code for all routes.
// app.use("/admin",adminAuth);
// app.use("/user",userAuth);
app.use("/user/data",userAuth,(req,res)=>{//can directly pass middleware here if only 1 route is there or pass in every route handler.its checks auth first then goes to callBack func.
    res.send("user data sent");
});
app.use("/user/profile",userAuth,(req,res)=>{
    res.send("user profile shown");
})
app.use("/admin/getAllData",adminAuth,(req,res)=>{
    res.send("sent all data");
});
app.use("/admin/deleteUserData",adminAuth,(req,res)=>{
    res.send("user data deleted");
})
app.listen(3440,()=>{
    console.log("server is currently listening on port 3440");
});