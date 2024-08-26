const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware"); // Import the auth middleware
const tenantMiddleware = require("../middleware/tenantMiddleware"); // Import the tenant middleware

const TAG_SERVICE_URL =
  process.env.TAG_SERVICE_URL || "http://localhost:5000/api/tags";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Routes for Tag Management Service

// Get all tags (publicly accessible)
router.get("/:tenantId/", async (req, res) => {
  try {
    const response = await axios.get(`${TAG_SERVICE_URL}/${req.tenantId}/`);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

// Create a new tag (secured route)
router.post("/:tenantId/", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${TAG_SERVICE_URL}/${req.tenantId}/`,
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
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

// Update an existing tag (secured route)
router.put("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${TAG_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

// Delete a tag (secured route)
router.delete("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
      `${TAG_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
