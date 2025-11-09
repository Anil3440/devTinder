const adminAuth = (req,res,next)=>{
    //authorize that admin sent the req
    const token = "admin";
    const isAdmin = token==="admin";//dummy token code
    if(!isAdmin){
        res.status(401).send("Unauthorized access");
    }else{
        console.log("checked adminAuth.")
        next();
    }
};
const userAuth =(req,res)=> {
    const token = "user";
    const isUser = token==="user";
    if(!isUser){
        res.status(401).send("Unauthorized access");
    }else{
        console.log("userAuth checked");
        next();
    }
}
module.exports = {
    adminAuth,userAuth,
}