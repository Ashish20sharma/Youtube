const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
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

userSchema.pre("save", async (next) => {
    console.log(this.password)
    // if (!this.isModified("password")) return next();
    bcrypt.genSalt(10, async(err,salt)=>{
        if(err){
            console.log("Error in generaging salt",err);
        }else{
             bcrypt.hash(this.password, salt,function(err,hash){
                if(err){
                    console.log("Error in hashing password",err)
                }else{
                    console.log("Hashed password",hash)
                    next();
                }
            });
        }
    })
});

userSchema.method.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
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