const asynchandler = require('express-async-handler');
const userModel = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while generating referesh and access token" });
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

const login = asynchandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!(email || username)) {
        res.status(201).json({ message: "Please provide username and email" });
    }

    const user = await userModel.findOne({ '$or': [{ email }, { username }] });
    if (!user) {
        res.status(201).json({ message: "Please provide valid email and username" });
    }

    const varifyPassword = await user.isPasswordCorrect(password);
    if (!varifyPassword) {
        res.status(201).json({ message: "Please provide valid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await userModel.findById(user._id).select("-password -refresh");
    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ user: loggedInUser, refreshToken, accessToken, message: "User logged In successfully" });

});

const logout = asynchandler(async (req, res) => {
    await userModel.findOneAndUpdate(req.user._id,
        { $set: { refreshtoken: undefined } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "User logout successfully." });
});

const refreshAccessToken = asynchandler(async function (req, res) {
    try {
        const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingrefreshToken) {
            res.status(400).json({ message: "Unauthorized request" });
        }

        const decoded = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_KEY);
        const user = userModel.findById(decoded._id);
        if (!user) {
            res.status(400).json({ message: "Invallid refresh token" });
        }

        if (incomingrefreshToken !== user?.refreshtoken) {
            res.status(400).json({ message: "refresh token is invalid" });
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(usre._id);
        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ message: "Access token refreshed" });
    } catch (error) {
        res.status(400).json({ message: "Error in accessRefresh token" });
    }
})

const updatePassword = asynchandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword || newPassword)) {
        res.status(400).json({ message: "Please provide old password and new password" });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
        res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        res.status(400).json({ message: "Please provide correct old password" });
    }

    user.password = newPassword;
    await user.save({ velidateBeforeSave: false });
    res.status(200).json({ message: "Password changed successfully." });
})

const getCurrentUser = asynchandler(async (req, res) => {
    return res.status(200).json({ user: req.user, message: "Current user successfully get." })
})

const updateDetails = asynchandler(async (req, res) => {
    const { email, username, fullname } = req.body;

    if (!email || !fullname || !username) {
        res.status(400).json({ message: "All field are required." });
    }
    const user = await userModel.findOneAndUpdate(req.user._id,
        {
            $set: {
                email,
                username,
                fullname
            }
        },
        { new: true }
    );

    if (!user) {
        res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ user,message: "Details update successfully." })
})

const updateAvtar = asynchandler(async (req, res) => {
    const avtarLocalPath = req.file.path;

    if (!avtarLocalPath) {
        res.status(400).json({ message: "Please provide Avtar for update." });
    }

    const avtar=await uploadOnCloudinary(avtarLocalPath);
    if(!avtar.url){
        res.status(400).json({message:"Error while uploading avatar."})
    }

    await userModel.findByIdAndUpdate(req.user._id,
        {
            $set:{
                avtar:avtar.url
            }
        },
        {new:true}
    );

    res.status(200).json({user,message:"Avtar update successfully."})

})

const updateCoverImage = asynchandler(async (req, res) => {
    const coverImageLocalPath = req.file.path;

    if (!coverImageLocalPath) {
        res.status(400).json({ message: "Please provide Avtar for update." });
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage.url){
        res.status(400).json({message:"Error while uploading Coverimage."})
    }

   const user= await userModel.findByIdAndUpdate(req.user._id,
        {
            $set:{
                coverimage:coverImage.url
            }
        },
        {new:true}
    );

    res.status(200).json({user,message:"Coverimage update successfully."})

})

module.exports = { register, login, logout, refreshAccessToken, updatePassword, updateDetails, getCurrentUser,updateAvtar,updateCoverImage };