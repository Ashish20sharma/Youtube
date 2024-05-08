const asynchandler=require('express-async-handler');

const register=asynchandler(async(req,res)=>{
    res.status(200).json({message:"register successfull"})
});

module.exports=register;