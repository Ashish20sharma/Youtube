const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true, 
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    avtar: {
        type: String,
        required: true
    },
    watchhistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }
    ],
    coverimage: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Password required"]
    },
    refreshtoken: {
        type: String,
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const saltRounds = 10;
        this.password= await bcrypt.hash(this.password, saltRounds)
        next();
    } catch (error) {
        console.log("Errror in hashing",error);
    }
             
});

userSchema.method.isPasswordCorrect = async function (Cpassword) {
    return bcrypt.compare(Cpassword, this.password);
}

userSchema.method.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        username:this.userSchema
    },process.env.JWT_KEY,{expiresIn:process.env.TOKEN_EXPIRY})
}

userSchema.method.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },process.env.REFRESH_TOKEN_KEY,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}
module.exports = mongoose.model("User", userSchema);