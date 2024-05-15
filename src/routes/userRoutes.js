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
router.route("/refresh-token").post(userControler.refreshAccessToken);
router.route("/update-Password").post(authmiddleware,userControler.updatePassword);
router.route("/update-details").post(authmiddleware,userControler.updateDetails);
router.route("/get-currentUser").get(authmiddleware,userControler.getCurrentUser);

module.exports = router;