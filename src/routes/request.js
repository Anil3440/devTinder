const express = require('express');
const {userAuth} = require('../middlewares/auth');

const requestRouter = express.Router();
//send connection request
requestRouter.post("/sendConnectionRequest", userAuth,async (req,res)=>{
    console.log("Sending connection req.");
    res.send("connection req sent");
})


module.exports = requestRouter;