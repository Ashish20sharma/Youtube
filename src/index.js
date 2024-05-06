require('dotenv').config();
const express=require('express')
const app=express();
const connectDb=require("./db/dbConnection")
const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`App listening on ${port}`);
    connectDb();
})