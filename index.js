const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const rateLimiter = require("./middleware/rateLimiterMiddleware");
const apiKeyMiddleware = require("./middleware/apiKeyMiddleware");
// Remove tenantMiddleware since it's now applied in specific routes

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimiter); // Apply the rate limiter to all requests

// Routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
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
app.use("/api/v1/:tenantid", tenantRoutes); // Protected route
app.use("/api/v1/:tenantid/keys", apiKeyRoutes); // Protected route
app.use("/api/v1/:tenantid/admin", adminRoutes); // Protected route
app.use("/api/v1/:tenantid/users", userRoutes); // Protect user-related routes
app.use("/api/v1/:tenantid/media", mediaRoutes); // Protected route

// CMS-related routes
app.use("/api/v1/:tenantid/analytics", apiKeyMiddleware, analyticsRoutes); // Protected route
app.use("/api/v1/:tenantid/categories", apiKeyMiddleware, categoryRoutes); // Protected route
app.use("/api/v1/:tenantid/comments", apiKeyMiddleware, commentRoutes); // Protected route
app.use("/api/v1/:tenantid/newsletters", newsletterRoutes); // Protected route
app.use("/api/v1/:tenantid/posts", postRoutes); // Protected route
app.use("/api/v1/:tenantid/social-media", apiKeyMiddleware, socialMediaRoutes); // Protected route
app.use("/api/v1/:tenantid/tags", apiKeyMiddleware, tagRoutes);

// Basic route to ensure the server is running
app.get("/:tenantid", (req, res) => {
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

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res
      .status(err.statusCode)
      .json({ message: err.message, errors: err.errors });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === "NotFoundError") {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Default to 500 if no specific error handler is matched
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app; // Export the app for testing and other uses

if (require.main === module) {
  // Start the server only if this script is run directly (not when imported for testing)
  const PORT = process.env.PORT || 2015;
  app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
  });
}
