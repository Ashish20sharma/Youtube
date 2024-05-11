const express = require('express');
const router = express.Router();
const register = require("../controllers/userControler")
const uploads = require("../middlewares/multer")
router.route("/register").post(uploads.fields(
    [{ name: "avtar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 }]), register);

module.exports = router;