// middleware/rateLimiter.js

const rateLimit = require("express-rate-limit");


function getClientIp(req) {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    return ips[0]; // The client's IP address is the first one in the list
  }
  return req.ip; // Fallback to req.ip if X-Forwarded-For is not set
}
// Create a rate limiter with custom settings
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window per 15 minutes
  message: "Too many requests from this IP, please try again after 15 minutes.",
  keyGenerator: (req) => getClientIp(req),
});

module.exports = limiter;
