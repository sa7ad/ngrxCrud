const multer = require("multer");
const express = require("express");
const userRoute = express();
const path = require("path");
const upload = multer({ dest: "./file" });
const userController = require("../controllers/userController");

userRoute.post("/register", userController.register);
userRoute.post("/login", userController.login);
userRoute.get("/user", userController.user);
userRoute.get("/profile", userController.profile);
userRoute.post(
  "/profile-upload-single",
  upload.single("image"),
  userController.updateImage
);
userRoute.post("/logOut", userController.logout);

module.exports = userRoute;
