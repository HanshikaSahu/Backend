const {nanoid} = require('nanoid');
const URL = require('../models/url');

async function handleCreateShortUrl(req, res) {
  const body = req.body;
  if(!body.url) return res.status(400).json({error: "URL is required"});
  
  const shortId = nanoid(8);

  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
    userId: req.user.id,
  });

  const allUrls = await URL.find({ userId: req.user._id });  
  return res.render("home", {
    urls: allUrls,
    id: shortId,  
  });
};


async function handleGetAnalytics(req, res){
  const shortId = req.params.shortId;
  const result = await URL.findOne({shortId});
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory
  })
};

module.exports = {
  handleCreateShortUrl,
  handleGetAnalytics
}