const mongoose=require("mongoose");

const subscriptionSchema=new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    chennel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timeseries:true});

module.exports=subscriptionSchema;