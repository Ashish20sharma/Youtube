const express = require('express');
const router = express.Router();
const userControler = require("../controllers/userControler")
const uploads = require("../middlewares/multer")
router.route("/register").post(uploads.fields(
    [{ name: "avtar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 }]), userControler.register);

router.route("/login").get(userControler.login);
module.exports = router;