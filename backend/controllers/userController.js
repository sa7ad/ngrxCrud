const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).send({
        message: "Email already registered",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
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
      res.send({ message: "Success" });
    }
  } catch (error) {}
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send({
        message: "Password is incorrect",
      });
    }
    const token = jwt.sign({ _id: user._id }, "secret");
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({
      message: "success",
    });
  } catch (error) {}
};
const user = async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "secret");
    if (!claims) {
      return res.status(401).send({
        message: "Unaunthenticated",
      });
    }
    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = await user.toJSON();
    res.send(data);
  } catch (error) {
    return res.status(401).send({ message: "Unauthenticated" });
  }
};
const updateImage = async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "secret");
    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
    const updateImage = await User.updateOne(
      { _id: claims._id },
      { $set: { image: req.file.filename } }
    );
    if (updateImage) {
      res.status(200).json({
        message: "image uploaded successfully",
      });
    } else {
      res.status(401).json({
        message: "Something went wrong",
      });
    }
  } catch (error) {}
};

const profile = async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "secret");
    if (!claims) {
      return res.status(401).send({
        message: "unauthenticated",
      });
    }
    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = await user.toJSON();
    res.send(data);
  } catch (error) {
    console.log(error.message);
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({ message: "success" });
  } catch (error) {}
};

module.exports = {
  register,
  login,
  user,
  logout,
  updateImage,
  profile,
};
