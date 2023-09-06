const express = require("express");
const adminRoute = express();
const adminController = require("../controllers/adminController");


adminRoute.post("/login", adminController.login);
adminRoute.get("/admin", adminController.admin);
adminRoute.get("/logout", adminController.logout);
adminRoute.get("/users", adminController.users);
adminRoute.post("/editUser/:id", adminController.editUser);
adminRoute.post("/edittedUser", adminController.edittedUser);
adminRoute.post("/deleteUser/:id", adminController.deleteUser);
adminRoute.post("/createUser", adminController.createUser);
adminRoute.post("/search", adminController.search);

module.exports = adminRoute;
