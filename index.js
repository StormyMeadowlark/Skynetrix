const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimiter = require("./middleware/rateLimiterMiddleware");
const apiKeyMiddleware = require("./middleware/apiKeyMiddleware");
const cors = require("cors");
dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Corrected CORS configuration
app.use(
  cors({
    origin: [
      "https://hemautomotive.com",
      "http://localhost:3000",
      "https://stormymeadowlark.com",
      "http://127.0.0.1:5173",
      "https://skynetrix.tech",
    ], // Correctly list the allowed origins without wildcards
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-tenant-id", "Authorization"], // Ensure required headers are allowed
    credentials: true, // Include this if you need to allow credentials (cookies, authorization headers)
  })
);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimiter); // Apply the rate limiter to all requests

// Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const postRoutes = require("./routes/postRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");
const tagRoutes = require("./routes/tagRoutes");

// Integrate the user management routes
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1", tenantRoutes);
app.use("/api/v1/keys", apiKeyRoutes); // Protected route
app.use("/api/v1/admin", adminRoutes); // Protected route
 // Protected route

// CMS-related routes
app.use("/api/v1/analytics", apiKeyMiddleware, analyticsRoutes); // Protected route
app.use("/api/v1/categories", apiKeyMiddleware, categoryRoutes); // Protected route
app.use("/api/v1/comments", apiKeyMiddleware, commentRoutes); // Protected route
app.use("/api/v1/newsletters", newsletterRoutes); // Protected route
app.use("/api/v1/social-media", apiKeyMiddleware, socialMediaRoutes); // Protected route
app.use("/api/v1/tags", apiKeyMiddleware, tagRoutes);

// Basic route to ensure the server is running
app.get("", (req, res) => {
  res.send(
    `API Gateway is running. Tenant: ${
      req.tenant ? req.tenant.name : "Unknown"
    }`
  );
});

// Connect to MongoDB
console.log("Attempting to connect to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: err.message });
  }

  if (err.name === "NotFoundError") {
    return res.status(404).json({ message: err.message });
  }

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 2015;
  app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
  });
}
