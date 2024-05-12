const asynchandler = require('express-async-handler');
const userModel = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");

const generateAccessAndRefereshTokens =async(userId)=>{
    try {
        const user=await userModel.findById(userId);
       const accessToken= user.generateAccessToken();
       const refreshToken= user.generateRefreshToken();

       user.refreshToken=refreshToken;
       await user.save({validateBeforeSave:false});

       return {accessToken,refreshToken};
    } catch (error) {
        res.status(500).json({message:"Something went wrong while generating referesh and access token"});
    }
}

const register = asynchandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;

    if (!username || !email || !fullname || !password) {
        res.status(201).json({ message: "plaese provide the all fields" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
        res.status(201).json({ message: "User already exist with this email" });
    }

    const avtarLocalpath = req.files?.avtar[0]?.path;
    const coverimageLocalpath = req.files?.coverimage[0]?.path;

    if (!avtarLocalpath) {
        res.status(201).json({ message: "please provide avatr" });
    }
    const avatar = await cloudinary(avtarLocalpath);
    const coverimage = await cloudinary(coverimageLocalpath);

    if (!avatar) {
        res.status(201).json({ message: "please provide avatr" });
    }

    try {
        const User = await userModel({ email, username: username.toLowerCase(), fullname, password, avtar: avatar.url, coverimage: coverimage?.url || "" });
        await User.save();
        const craeteduser = await userModel.findById(User._id).select("-password -refreshtoken");
        res.status(200).json({ message: "User register successfully", result: craeteduser })
    } catch (error) {
        throw new Error({ message: error.message });
    }
});

const login =asynchandler(async(req,res)=>{
    const {username,email,password}=req.body;

    if(!email||!username){
        res.status(201).json({message:"Please provide username and email"});
    }

    const user=userModel.findOne({$or:[{email},{username}]});
    if(!user){
        res.status(201).json({message:"Please provide valid email and username"});
    }

    const varifyPassword=await user.isPasswordCorrect(password);
    if(!varifyPassword){
        res.status(201).json({message:"Please provide valid credentials"});
    }

    const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id);

    const loggedInUser=await userModel.findById(user._id).select("-password -refresh");
    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({user:loggedInUser,refreshToken,accessToken,message:"User logged In successfully"});

});

const logout=asynchandler(async (req,res)=>{
   await userModel.findOneAndUpdate(req.user._id,
        {$set:{refreshtoken:undefined}},
        {new:true}
    );

    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({message:"User logout successfully."});
});



module.exports = {register,login,logout};