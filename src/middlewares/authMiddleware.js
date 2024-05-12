const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
const asynchandler=require("express-async-handler");

const verifyToken=asynchandler(async (req,res,next)=>{
    try {
        const token=req.cookies?.accessToken||req.headers("Authorization")?.replace("Berear ","");
    
        if(!token){
            throw new Error("token not found");
        }
        const decoded=jwt.verify(token,process.env.JWT_KEY);
        const user=await User.findById(decoded._id).select("-password -refreshtoken");
        if(!user){
            throw new Error("Invalid Access Token");
        }
        req.user=user;
        next();
    } catch (error) {
        throw new Error("Error in Access Token",error.message);
    }
});

module.exports=verifyToken;