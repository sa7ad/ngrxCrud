const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const credentials = {
  adminId: process.env.adminId,
  adminEmail: process.env.adminEmail,
  adminPassword: process.env.adminPass,
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (credentials.adminEmail === email) {
      if (credentials.adminPassword === password) {
        const token = jwt.sign({ _id: credentials.adminId }, "adminsecret");
        res.cookie("jwtAdmin", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.send({
          message: "Success",
        });
      } else {
        return res.status(404).send({
          message: "Password doesn't match admin password",
        });
      }
    } else {
      return res.status(404).send({
        message: "Admin email address doesn't match",
      });
    }
  } catch (error) {}
};

const admin = async (req, res) => {
  try {
    const cookie = req.cookies["jwtAdmin"];
    const claims = jwt.verify(cookie, "adminsecret");
    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
    res.status(200).send({
      message: "Success",
    });
  } catch (error) {
    return res.status(401).send({
      message: "unauthenticated",
    });
  }
};

const users = async (req, res) => {
  try {
    const userdata = await User.find({});
    res.json(userdata);
  } catch (error) {}
};

const editUser = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.params.id });
    if (!userData) {
      res.send({ message: "Something went wrong" });
    }
    const { password, ...data } = await userData.toJSON();
    res.send(data);
  } catch (error) {
    console.log(error.message);
  }
};

const edittedUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    let updatedUser = await User.updateOne(
      { email: email },
      { $set: { name: name } }
    );
    res.send({
      message: "success",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.deleteOne({ _id: req.params.id });
    if (!deleteUser) {
      res.send({
        message: "Deletion went wrong",
      });
    }
    res.send(deleteUser);
  } catch (error) {}
};

const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const record = await User.findOne({ email: email });
    if (record) {
      return res.status(400).send({ message: "Email is already registered" });
    } else {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      const result = await user.save();
      const { _id } = await result.toJSON();
      const token = jwt.sign({ _id: _id }, "secret");
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.send({
        message: "success",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const search = async (req, res) => {
  try {
    const { name } = req.body;
    const users = await User.find({
      name: { $regex: name, $options: "i" },
    });
    if (users.length > 0) {
      res.status(200).send(users);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("jwtAdmin", "", { maxAge: 0 });
    res.send({ message: "Success" });
  } catch (error) {}
};

module.exports = {
  login,
  admin,
  logout,
  users,
  editUser,
  edittedUser,
  deleteUser,
  createUser,
  search,
};
