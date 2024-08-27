const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

const COMMENT_SERVICE_URL =
  process.env.COMMENT_SERVICE_URL || "http://localhost:5000/api/comments";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Forward request to create a new comment (secured route)
router.post(
  "/:tenantId/:postId",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${COMMENT_SERVICE_URL}/${req.tenantId}/${req.params.postId}`;
      const response = await axios.post(url, req.body, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding create comment request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Comment Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get all comments for a post (secured route)
router.get(
  "/:tenantId/:postId",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${COMMENT_SERVICE_URL}/${req.tenantId}/${req.params.postId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding get comments request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Comment Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to delete a comment (secured route)
router.delete(
  "/:tenantId/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${COMMENT_SERVICE_URL}/${req.tenantId}/${req.params.id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding delete comment request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Comment Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to update a comment (secured route)
router.put(
  "/:tenantId/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${COMMENT_SERVICE_URL}/${req.tenantId}/${req.params.id}`;
      const response = await axios.put(url, req.body, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding update comment request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Comment Service" };
      res.status(status).json(data);
    }
  }
);

module.exports = router;
