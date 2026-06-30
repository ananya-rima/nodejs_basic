const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes

  limit: 100, // maximum 5 requests

  message: "Too many requests, try later",
});

module.exports = limiter;
