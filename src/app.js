const express = require('express');

const app = express();
//This will match all HTTP method Api calls to /test.
app.use("/test",(req,res)=>{
    res.send("Welcome to home page.");
});

//This will only match GET Api calls to /user.
app.get("/user",(req,res)=>{
    
    res.send({firstName:"Anil",lastName:"Choudhary"});
})
app.post("/user",(req,res)=>{
    //Save data to DB code
    res.send("Data saved successfully to DB");
})
app.delete("/user",(req,res)=>{
    res.send("user deleted successfully");
})

app.get("/abc/:userid/:username",(req,res)=>{//ab+b->b can occur 1 or more times,ab?c->b can occur 0 or 1 time,ab*c->b can occur 0 or more times.
    //had to put the string in /abc/ -> Regex because if i use string it throws error for advance routing methods like *,?,+.
    // console.log(req.query);
    console.log(req.params);
    res.send({firstName:"Anil",lastName:"Choudhary"});//   /.*fly$/->anything ending with fly works.
})


app.listen(3440,()=>{
    console.log("server is currently listening on port 3440");
});