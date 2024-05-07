const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        typr: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        lowercase: true
    },
    email: {
        typr: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    fullname: {
        typr: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
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

userSchema.pre("save", async (next) => {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10);
});

userSchema.method.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.method.generateAccessToken = function () {
    return jwt.sign({
        _id: this.id,
        username:this.userSchema
    },process.env.JWT_KEY,{expiresIn:process.env.TOKEN_EXPIRY})
}
userSchema.method.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id,
    },process.env.REFRESH_TOKEN_KEY,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}
module.exports = mongoose.model("User", userSchema);