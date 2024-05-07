const mongoose = require('mongoose');

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

module.exports=mongoose.model("User",userSchema);