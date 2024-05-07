const mongoose = require('mongoose');
const bcrypt=require("bcrypt")

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
    coverimage:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:[true,"Password required"]
    },
    refreshtoken:{
        type:String,
    },
},{timestamps:true});

userSchema.pre("save",async(next)=>{
    if(!this.isModified("password")) return next();

    this.password=bcrypt.hash(this.password, 10);
});

userSchema.method.isPasswordCorrect= async function(password){
    return bcrypt.compare(password,this.password);
}
module.exports=mongoose.model("User",userSchema);