const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api", userRoute);
app.use("/api/admin", adminRoute);
app.use('/file', express.static('file'));

mongoose
  .connect(process.env.mongoUrl)
  .then(() => console.log("Mongodb Server Connected"))
  .catch(() => console.log("Server Not Connected"));

app.listen(5000, () => console.log("Server Conected"));
