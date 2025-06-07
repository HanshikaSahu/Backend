const express = require('express');
const router = express.Router();
const { getUser } = require('../server/Auth');
const URL = require('../models/url');

router.get("/", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.render("login");
  }

  const user = await getUser(token);
  if (!user) {
    return res.render("login");
  }

  let allUrls = [];

  // Check role
  if (user.role === "ADMIN") {
    allUrls = await URL.find({});
  } else {
    allUrls = await URL.find({ userId: user._id });
  }

  return res.render("home", { urls: allUrls, user });
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
