require('dotenv').config();

const express = require('express');
const path = require('path');
const { connectMongoDb } = require('./connect');
const URL = require('./models/url');
const cookieParser = require('cookie-parser');
const {checkForAuthentication, restrictTo} = require('./middlewares/auth');

const  urlRouter  = require('./routes/url');
const  staticRouter = require('./routes/staticRouter');
const userRouter = require('./routes/user');

const app = express();
const PORT = 8001;

console.log("Mongo URI:", process.env.MONGO_URI);
connectMongoDb(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDb Connected");
});


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/url",checkForAuthentication, restrictTo(["NORMAL"]), urlRouter);
app.use("/", staticRouter);
app.use("/user", userRouter);

app.get("/url/:shortId", async(req, res) => {
  const allUrls = await URL.find({});
  const shortId = req.params.shortId;
  return res.render("home", {
    urls: allUrls,
    id: shortId,  
  });
})


app.get('/:shortId', async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }  
    );

    if (!entry) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error('Error in redirecting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => { console.log("Server Started")});