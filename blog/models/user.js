const {Schema, model} = require('mongoose');
const {Hmac, randomBytes, createHmac} = require('crypto');
const { createTokenForUser } = require('../service/authentication');

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String, 
    required: true,
    unique: true,
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageURL: {
    type: String,
    default: "/images/avatarProfile.webp",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  }
}, { timestamps: true});

userSchema.pre("save", function(next) {
  const user = this;

  if(!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hash = createHmac("sha256", salt)
  .update(user.password)
  .digest("hex");

  this.salt = salt;
  this.password = hash;

  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function(email, password) {
   const user = await this.findOne({email});
    if(!user) {
      return res.status(400).json({error: "Invalid credentials"});
    };
    const salt = user.salt;
    const hash = user.password;

    const userProvidedHashPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(userProvidedHashPassword !== hash) throw new Error("Incorrect password");
 
    const token = createTokenForUser(user);
    return token;
})

const User = model("user", userSchema);

module.exports = User;