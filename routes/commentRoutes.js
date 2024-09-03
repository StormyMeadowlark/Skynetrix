const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

const COMMENT_SERVICE_URL =
  process.env.COMMENT_SERVICE_URL || "http://localhost:5000/api/comments";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId", tenantMiddleware);

// Forward request to create a new comment (secured route)
router.post("/:tenantId/:postId", authMiddleware, async (req, res) => {
  try {
    console.log(
      `[API Gateway] Forwarding create comment request for tenantId: ${req.params.tenantId}, postId: ${req.params.postId}`
    );

    const response = await axios.post(
      `${COMMENT_SERVICE_URL}/${req.params.tenantId}/${req.params.postId}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "X-Tenant-Id": req.params.tenantId,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[API Gateway] Error forwarding create comment request:",
      error.message
    );

    if (error.response) {
      console.error(
        "[API Gateway] Error response status:",
        error.response.status
      );
      console.error("[API Gateway] Error response data:", error.response.data);
    } else {
      console.error("[API Gateway] No response received from Comment Service.");
    }

    res
      .status(error.response ? error.response.status : 500)
      .json(
        error.response
          ? error.response.data
          : { message: "Error connecting to Comment Service" }
      );
  }
});

// Forward request to get all comments for a post
router.get("/:tenantId/:postId", async (req, res) => {
  try {
    console.log(
      `[API Gateway] Forwarding get comments request for tenantId: ${req.params.tenantId}, postId: ${req.params.postId}`
    );

    const response = await axios.get(
      `${COMMENT_SERVICE_URL}/${req.params.tenantId}/${req.params.postId}`,
      {
        headers: {
          "X-Tenant-Id": req.params.tenantId,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[API Gateway] Error forwarding get comments request:",
      error.message
    );

    res
      .status(error.response ? error.response.status : 500)
      .json(
        error.response
          ? error.response.data
          : { message: "Error connecting to Comment Service" }
      );
  }
});

// Forward request to delete a comment
router.delete("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    console.log(
      `[API Gateway] Forwarding delete comment request for tenantId: ${req.params.tenantId}, commentId: ${req.params.id}`
    );

    const response = await axios.delete(
      `${COMMENT_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "X-Tenant-Id": req.params.tenantId,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[API Gateway] Error forwarding delete comment request:",
      error.message
    );

    res
      .status(error.response ? error.response.status : 500)
      .json(
        error.response
          ? error.response.data
          : { message: "Error connecting to Comment Service" }
      );
  }
});

// Forward request to update a comment
router.put("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    console.log(
      `[API Gateway] Forwarding update comment request for tenantId: ${req.params.tenantId}, commentId: ${req.params.id}`
    );

    const response = await axios.put(
      `${COMMENT_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "X-Tenant-Id": req.params.tenantId,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "[API Gateway] Error forwarding update comment request:",
      error.message
    );

    res
      .status(error.response ? error.response.status : 500)
      .json(
        error.response
          ? error.response.data
          : { message: "Error connecting to Comment Service" }
      );
  }
});

module.exports = router;
