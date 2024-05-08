const express=require('express')
const app=express();
const cookieParser=require("cookie-parser");
const cors=require('cors');
const userRouter = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users",userRouter)

module.exports=app;