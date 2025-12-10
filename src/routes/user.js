const express = require('express');
const {userAuth} = require('../middlewares/auth');
const {ConnectionRequest} = require('../models/connectionRequest');

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested',
        }).populate("fromUserId",USER_SAFE_DATA);
        // }).populate("fromUserId",["firstName","lastName"]);
        

        if(connectionRequests.length==0){
            return res.json({
                message: 'you dont have any pending received requests.'
            });
        }
        res.json({
            message: 'pending connection request sent to you are: ',
            data: connectionRequests,
        });
    }
    catch(err){
        res.status(400).send('ERROR: '+err.message);
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const approvedConnections = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id,
                    status: "accepted",
                },
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted",
                }
            ]
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);

        const data = approvedConnections.map(conn=>conn.fromUserId._id.equals(loggedInUser._id)?conn.toUserId:conn.fromUserId);

        if(approvedConnections.length==0){
            return res.send("You dont have any connections yet:(");
        }
        res.json({
            message: "Your current connections are: ",
            data: data,
        });
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

module.exports = userRouter;