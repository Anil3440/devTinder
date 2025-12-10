const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        // fromUserName: {
        //     type: String,
        //     required: true,
        // },
        
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        // toUserName: {
        //     type: String,
        //     required: true,
        // },

        status: {
            type: String,
            enum: {
                values: ['interested','ignored','accepted','rejected'],
                message: "{VALUE} is not a valid status.",
            },
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

connectionRequestSchema.index({fromUserId : 1, toUserId : 1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to oneself.");
    }
    next();
});

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = {ConnectionRequest};