const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

const ANALYTICS_SERVICE_URL =
  process.env.ANALYTICS_SERVICE_URL || "http://localhost:5001/api/analytics";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Forward request to record a view for a specific post (secured route)
router.post(
  "/:tenantId/record/:postId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/record/${req.params.postId}`,
        req.body,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding record view request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get analytics data for a specific post (secured route)
router.get(
  "/:tenantId/post/:postId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/post/${req.params.postId}`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding get analytics request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get all analytics data (admin-only, secured route)
router.get(
  "/:tenantId/",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding get all analytics request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get summary analytics for a tenant (secured route)
router.get(
  "/:tenantId/summary",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/summary`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding get summary analytics request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get analytics data over time for a specific post (secured route)
router.get(
  "/:tenantId/post/:postId/time-range",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Expect startDate and endDate as query parameters
      const response = await axios.get(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/post/${req.params.postId}/time-range`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
          params: { startDate, endDate }, // Forward the time range as query parameters
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding get analytics over time request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get analytics data for all posts for a tenant (secured route)
router.get(
  "/:tenantId/posts",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/posts`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding get analytics for all posts request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get analytics data by category for a tenant (secured route)
router.get(
  "/:tenantId/category/:categoryId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/category/${req.params.categoryId}`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding get analytics by category request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to delete analytics data for a specific post (admin-only, secured route)
router.delete(
  "/:tenantId/post/:postId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.delete(
        `${ANALYTICS_SERVICE_URL}/${req.tenantId}/post/${req.params.postId}`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding delete analytics data request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Analytics Service" };
      res.status(status).json(data);
    }
  }
);

module.exports = router;
