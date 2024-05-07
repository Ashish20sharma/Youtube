const express=require('express')
const app=express();
const cookieParser=require("cookie-parser");
const cors=require('cors');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

module.exports=app;