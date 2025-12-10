const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
// const adminAuth = (req,res,next)=>{
//     //authorize that admin sent the req
//     const token = "admin";
//     const isAdmin = token==="admin";//dummy token code
//     if(!isAdmin){
//         res.status(401).send("Unauthorized access");
//     }else{
//         console.log("checked adminAuth.")
//         next();
//     }
// };
// const userAuth =(req,res)=> {
//     const token = "user";
//     const isUser = token==="user";
//     if(!isUser){
//         res.status(401).send("Unauthorized access");
//     }else{
//         console.log("userAuth checked");
//         next();
//     }
// }
const userAuth = async (req,res,next)=> {
    try{
        //read the token from req cookies
        const {token} = req.cookies;
        //validate the token
        if(!token){
            throw new Error("token expired");
        }
        const decodedMessage = await jwt.verify(token,"secretKey@40");
        const{_id} = decodedMessage;
        
        //find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("user not found");
        }else{
            req.user = user;
            next();
        }
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }

}
module.exports = {
    userAuth,
}