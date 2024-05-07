const mongoose=require("mongoose");
const mongooseAggregatePaginate =require("mongoose-aggregate-paginate-v2");

const videoSchema=new mongoose.Schema({
    videofile:{
        type:String,   //cloudnary url
        required:true
    },
    thumbnail:{
        type:String,   //cloudnary url
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true
    },
    view:{
        type:Number,
        default:0
    },
    ispublished:{
        type:Boolean,
        default:true
    }

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate);
module.exports=mongoose.model("Video",videoSchema);