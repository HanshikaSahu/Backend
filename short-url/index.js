const express = require('express');
const { connectMongoDb } = require('./connect');
const { router } = require('./routes/url');
const URL = require('./models/url');

const app = express();
const PORT = 8001;

connectMongoDb("mongodb://localhost:27017/short-url")
.then(() => {
  console.log("MongoDb Connected");
});

app.use(express.json());
app.use("/url", router);

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

app.listen(PORT, () => { console.log("Server Started")})