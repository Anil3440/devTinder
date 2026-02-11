const express = require('express');
const {connectDB} = require('./config/database');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));//using cors middleware for handling cors error i get while sending api req from frontend to backend api.
app.use(express.json());//using an express inbuilt middleware to convert JSON to js object to see on console
app.use(cookieParser());//using cookieParser middleware to pase a cookie send back to server from user to authenticate a valid user

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user')

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);


connectDB()
    .then(()=>{
        console.log("connected to db successfully");
        app.listen(3440,()=>{
            console.log("server is currently listening on port 3440");
        });
    })
    .catch((err)=>{
        console.error("error connecting to db");
    });

