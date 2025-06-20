const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async(req, res) => {
  const {email,password} = req.body;
   try{
    if(!email || !password) {
    return res.status(400).json({error: "All fields are required"});
  };
  const token = await User.matchPasswordAndGenerateToken(email, password);

  return res.cookie("token", token).redirect("/");
   }
   catch(err){
    return res.render("signin", {
      error: "Incorrect password or email",
      user: null,
    });
   }
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async(req, res) => {
  const {fullname, email, password} = req.body;
  if(!fullname || !email || !password) {
    return res.status(400).json({error: "All fields are required"});
  }
  await User.create({
    fullname,
    email,
    password,
  });
  return res.redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
})

module.exports = router;