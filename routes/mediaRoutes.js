const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

const UM_MEDIA_SERVICE_URL =
  process.env.UM_MEDIA_SERVICE_URL || "http://localhost:5000/api/media"; // Set this URL to point to your Media Service
const MEDIA_SERVICE_URL =
  process.env.MEDIA_SERVICE_URL || "http://localhost:5000/api/media";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Route to upload media (secured route)
router.post(
  "/:tenantId/upload",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${UM_MEDIA_SERVICE_URL}/${req.tenantId}/upload`;
      const response = await axios.post(url, req.body, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
          "Content-Type": req.header("Content-Type"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to the Media Service" };
      res.status(status).json(data);
    }
  }
);

// Route to get all media (secured route)
router.get(
  "/:tenantId/",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${UM_MEDIA_SERVICE_URL}/${req.tenantId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to the Media Service" };
      res.status(status).json(data);
    }
  }
);

// Route to get media by ID (secured route)
router.get(
  "/:tenantId/:id",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${UM_MEDIA_SERVICE_URL}/${req.tenantId}/${req.params.id}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to the Media Service" };
      res.status(status).json(data);
    }
  }
);

// Route to delete media by ID (secured route)
router.delete(
  "/:tenantId/:id",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${UM_MEDIA_SERVICE_URL}/${req.tenantId}/${req.params.id}`;
      const response = await axios.delete(url, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to the Media Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to upload media (secured route)
router.post(
  "/:tenantId/upload",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${MEDIA_SERVICE_URL}/${req.tenantId}/upload`,
        req.body,
        {
          headers: {
            Authorization: req.header("Authorization"),
            "Content-Type": req.header("Content-Type"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding media upload request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Media Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get all media (secured route)
router.get(
  "/:tenantId/",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${MEDIA_SERVICE_URL}/${req.tenantId}/`,
        {
          headers: {
            Authorization: req.header("Authorization"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding get all media request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Media Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get media by ID (secured route)
router.get(
  "/:tenantId/:id",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${MEDIA_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
        {
          headers: {
            Authorization: req.header("Authorization"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding get media by ID request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Media Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to delete media (secured route)
router.delete(
  "/:tenantId/:id",
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.delete(
        `${MEDIA_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
        {
          headers: {
            Authorization: req.header("Authorization"),
          },
        }
      );
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding delete media request:", error.message);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Media Service" };
      res.status(status).json(data);
    }
  }
);

module.exports = router;
