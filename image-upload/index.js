const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 8001;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false}));

app.get("/", (req, res) => {
  return res.render("homepage");
});

app.post("/upload", upload.fields([{name: "image"}, {name: "coverImage"}]) , (req, res) => {
  console.log(req.body);
  console.log(req.file);
  return res.redirect("/");
})

app.listen(PORT, () => {
  console.log("Server Started");
});