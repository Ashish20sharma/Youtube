const express = require('express');
const router = express.Router();
const userControler = require("../controllers/userControler");
const uploads = require("../middlewares/multer");
const authmiddleware=require("../middlewares/authMiddleware");

router.route("/register").post(uploads.fields(
    [{ name: "avtar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 }]), userControler.register);
router.route("/login").post(userControler.login);
router.route("/logout").post(authmiddleware,userControler.logout);

module.exports = router;