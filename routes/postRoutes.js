const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

const POST_SERVICE_URL =
  process.env.POST_SERVICE_URL || "http://localhost:5001/api/posts";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/", tenantMiddleware);

// Create a new post
router.post("/:tenantId", authMiddleware, async (req, res) => {
  try {
    console.log(
      `[API Gateway] Forwarding create post request for tenantId: ${req.params.tenantId}`
    );
    console.log(
      `[API Gateway] Forwarding Authorization: ${req.header("Authorization")}`
    );

    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.params.tenantId}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-tenant-id": req.params.tenantId,
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[API Gateway] Error forwarding create post request:",
      error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json(
        error.response
          ? error.response.data
          : { message: "Error connecting to Post Service" }
      );
  }
});


// Get all posts (published) for a specific tenant
router.get("/:tenantId", async (req, res) => {
  try {
    const response = await axios.get(
      `${POST_SERVICE_URL}/${req.params.tenantId}`,
      {
        headers: {
          "X-Tenant-Id": req.params.tenantId,
        },
      }
    );
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
router.get("/:tenantId/:postId", async (req, res) => {
  try {
    const response = await axios.get(
      `${POST_SERVICE_URL}/${req.params.tenantId}/${req.params.postId}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "X-Tenant-Id": req.params.tenantId,
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get post by ID request:", error.message);
    res
      .status(error.response ? error.response.status : 500)
      .json(
        error.response
          ? error.response.data
          : { message: "Error connecting to Post Service" }
      );
  }
});
// Update a post
router.put("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${POST_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`,
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

// Delete a post
router.delete("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
      `${POST_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`,
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

// Publish a post
router.post("/:tenantId/:id/publish", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.params.tenantId}/${req.params.id}/publish`,
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

// Unpublish a post
router.post("/:tenantId/:id/unpublish", authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.params.tenantId}/${req.params.id}/unpublish`,
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

module.exports = router;
