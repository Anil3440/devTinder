const express = require('express');
const {userAuth} = require('../middlewares/auth');
const {ConnectionRequest} = require('../models/connectionRequest');
const {User} = require('../models/user');

const requestRouter = express.Router();
//send connection request
requestRouter.post("/request/send/:status/:userId", userAuth,async (req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        // const fromUserName = req.user.firstName+" "+req.user.lastName;
        
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).send({message: "User not found",data: toUserId});
        }
        // const toUserName = toUser.firstName+" "+toUser.lastName;

        const validStatuses= ["interested","ignored"];
        if(!validStatuses.includes(status)){
            return res.status(400).json({message: "invalid status passed: "+status});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId,},
                {fromUserId: toUserId,toUserId: fromUserId,},
            ]
        });

        if(existingConnectionRequest){
            return res.status(400).json({
                message: "a request is already pending.",
            });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
            // fromUserName,
            // toUserName,
        });

        const data = await connectionRequest.save();
        res.json({
            message: `Connection request with status: ${status} sent successfully to ${toUser.firstName}.`,
            data,
        });
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId",
    userAuth,
    async(req,res)=>{
        try{
            const loggedInUser = req.user;
            const status = req.params.status;
            const requestId = req.params.requestId;
            const targetedRequest = await ConnectionRequest.findById(requestId);
            
            if(!targetedRequest){
                return res.status(404).json({message: 'Connection request not found'});
            }
            
            const isValidUser = loggedInUser._id.equals(targetedRequest.toUserId);
            if(!isValidUser){
                return res.status(400).send("you cannot "+status+" the request");
            }
            
            const validStatuses = ['accepted','rejected'];
            if(!validStatuses.includes(status)){
                return res.status(400).json({message: 'invalid status passed: '+status});
            }

            const validPendingStatuses = ['interested'];
            if(!validPendingStatuses.includes(targetedRequest.status)){
                return res.status(400).send(`Cannot ${status} a request which is already ${targetedRequest.status}.`);
            }

            targetedRequest.status = status;
            await targetedRequest.save();

            res.json({
                message: "Connection request status updated successfully.",
                data: targetedRequest,
            });

        }catch(err){
            res.status(400).send("ERROR: "+err.message);
        }
    });

module.exports = requestRouter;