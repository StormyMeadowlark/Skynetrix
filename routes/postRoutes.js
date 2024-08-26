const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware"); // Import the auth middleware
const tenantMiddleware = require("../middleware/tenantMiddleware"); // Import the tenant middleware

const POST_SERVICE_URL =
  process.env.POST_SERVICE_URL || "http://localhost:5000/api/posts";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Routes for Post Management Service

// Create a new post (secured route)
router.post("/:tenantId/", authMiddleware, async (req, res) => {
  try {
    console.log("Token being sent:", req.header("Authorization"));

    const requestBody = req.body;

    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.tenantId}/`,
      requestBody,
      {
        headers: {
          Authorization: req.header("Authorization"), // Forwarding the token
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding create post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Get all posts (published) for a specific tenant
router.get("/:tenantId/", async (req, res) => {
  try {
    const response = await axios.get(`${POST_SERVICE_URL}/${req.tenantId}/`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get all posts request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Get a specific post by ID for a specific tenant
router.get("/:tenantId/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${POST_SERVICE_URL}/${req.tenantId}/${req.params.id}`
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get post by ID request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Update a post (secured route)
router.put("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${POST_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding update post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Delete a post (secured route)
router.delete("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
      `${POST_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding delete post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Publish a post (secured route)
router.post("/:tenantId/:id/publish", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.tenantId}/${req.params.id}/publish`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding publish post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Unpublish a post (secured route)
router.post("/:tenantId/:id/unpublish", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.tenantId}/${req.params.id}/unpublish`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding unpublish post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Like a post (secured route)
router.post("/:tenantId/:postId/like", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.tenantId}/${req.params.postId}/like`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding like post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Dislike a post (secured route)
router.post("/:tenantId/:postId/dislike", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.tenantId}/${req.params.postId}/dislike`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding dislike post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
