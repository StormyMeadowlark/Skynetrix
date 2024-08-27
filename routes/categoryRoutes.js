const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

const CATEGORY_SERVICE_URL =
  process.env.CATEGORY_SERVICE_URL || "http://localhost:5000/api/categories";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Forward request to get all categories (secured route)
router.get(
  "/:tenantId/",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${CATEGORY_SERVICE_URL}/${req.tenantId}/`,
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
        "Error forwarding get all categories request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Category Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to create a new category (secured route)
router.post(
  "/:tenantId/",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${CATEGORY_SERVICE_URL}/${req.tenantId}/`,
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
      console.error("Error forwarding create category request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Category Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to update a category (secured route)
router.put(
  "/:tenantId/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.put(
        `${CATEGORY_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
      console.error("Error forwarding update category request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Category Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to delete a category (secured route)
router.delete(
  "/:tenantId/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.delete(
        `${CATEGORY_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "x-api-key": req.header("x-api-key"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding delete category request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Category Service" };
      res.status(status).json(data);
    }
  }
);

module.exports = router;
