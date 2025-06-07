const jwt = require('jsonwebtoken');
const User = require('../models/user');
 
const secret = process.env.JWT_SECRET;

function setUser(user){
  return jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role,
  }, 
  secret);
};

async function getUser(token){
  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    console.log("JWT Error:", error.message);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
}