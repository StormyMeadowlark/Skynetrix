const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware"); // Import the auth middleware
const tenantMiddleware = require("../middleware/tenantMiddleware"); // Import the tenant middleware

const SOCIAL_MEDIA_SERVICE_URL =
  process.env.SOCIAL_MEDIA_SERVICE_URL ||
  "http://localhost:5000/api/social-media";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Routes for Social Media Management Service

// Create a new social media post (secured route)
router.post("/:tenantId/", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${SOCIAL_MEDIA_SERVICE_URL}/${req.tenantId}/`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

// Update a social media post (secured route)
router.put("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${SOCIAL_MEDIA_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

// Schedule a social media post (secured route)
router.post("/:tenantId/schedule/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${SOCIAL_MEDIA_SERVICE_URL}/${req.tenantId}/schedule/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

// Publish a social media post (secured route)
router.post("/:tenantId/publish/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${SOCIAL_MEDIA_SERVICE_URL}/${req.tenantId}/publish/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
