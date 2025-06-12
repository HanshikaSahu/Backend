require('dotenv').config()

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const {checkForAuthenticationCookie} = require("./middlewares/authentication");
const Blog = require("./models/blog")

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async(req, res) => {
  const allBlogs = await Blog.find({});
  res.render("Homepage", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

mongoose.connect(process.env.MONGO_URL)
.then((e) => {
  console.log("MongoDB Connected");
})

app.listen(PORT, () => {
  console.log("Server Started");
});