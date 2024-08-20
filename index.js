const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const apiKeyMiddleware = require("./middleware/apiKeyMiddleware");
dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

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
app.use("/api/v1/tenants", tenantRoutes); // Protected route
app.use("/api/v1/keys", apiKeyRoutes); // Protected route
app.use("/api/v1/admin", adminRoutes); // Protected route
app.use("/api/v1/users", userRoutes); // Protect user-related routes
app.use("/api/v1/media", mediaRoutes); // Protected route

// CMS-related routes
app.use("/api/v1/analytics", apiKeyMiddleware, analyticsRoutes); // Protected route
app.use("/api/v1/categories", apiKeyMiddleware, categoryRoutes); // Protected route
app.use("/api/v1/comments", apiKeyMiddleware, commentRoutes); // Protected route
app.use("/api/v1/newsletters", apiKeyMiddleware, newsletterRoutes); // Protected route
app.use("/api/v1/posts", postRoutes); // Protected route
app.use("/api/v1/social-media", apiKeyMiddleware, socialMediaRoutes); // Protected route
app.use("/api/v1/tags", apiKeyMiddleware, tagRoutes);

// Basic route to ensure the server is running
app.get("/", (req, res) => {
  res.send("API Gateway is running.");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

module.exports = app; // Export the app for testing and other uses

if (require.main === module) {
  // Start the server only if this script is run directly (not when imported for testing)
  const PORT = process.env.PORT || 2015;
  app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
  });
}
