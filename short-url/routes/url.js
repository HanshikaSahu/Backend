const express = require('express');
const { checkForAuthentication } = require('../middlewares/auth');

const {
  handleCreateShortUrl,
  handleGetAnalytics
 } = require('../controllers/url');

const router = express.Router();

router.post("/",checkForAuthentication, handleCreateShortUrl);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;

