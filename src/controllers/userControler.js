const asynchandler=require('express-async-handler');
const userModel=require("../models/userModel");
const cloudinary=require("../utils/cloudinary");

const register=asynchandler(async(req,res)=>{
    const {username,email,fullname,password}=req.body;

    if(!username||!email||!fullname||!password){
      res.status(201).json({message:"plaese provide the all fields"});
    }
    const user= await userModel.findOne({email});
    if(user){
      res.status(201).json({message:"User already exist with this email"});
    }

    const avtarLocalpath=req.files?.avtar[0]?.path;
    const coverimageLocalpath=req.files?.coverimage[0]?.path;

    if(!avtarLocalpath){
        res.status(201).json({message:"please provide avatr"});
    }
    const avatar= await cloudinary(avtarLocalpath);
    const coverimage= await cloudinary(coverimageLocalpath);
    
    if(!avatar){
        res.status(201).json({message:"please provide avatr"});
    }

    // try {
        const User= await userModel.create({email,username:username.toLowerCase(),fullname,password,avtar:avatar.url,coverimage:coverimage?.url||""});
        const craeteduser= await userModel.findById(User._id).select("-password -refreshtoken");
        // await User.save();
        res.status(200).json({message:"User register successfully",result:craeteduser})
    // } catch (error) {
        // throw new Error({message:error.message});
    // }
});

module.exports=register;