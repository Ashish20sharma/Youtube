const express=require('express');
const router=express.Router();
const register=require("../controllers/userControler")

router.route("/register").post(register);

module.exports=router;