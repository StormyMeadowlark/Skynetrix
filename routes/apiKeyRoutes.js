const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const API_KEY_SERVICE_URL =
  process.env.API_KEY_SERVICE_URL || "http://localhost:5000/api/keys"; // Set this URL to point to your API Key Management Service

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Route to generate an API key for a specific tenant (secured route)
router.post("/:tenantId/generate-api-key", async (req, res) => {
  try {
    const response = await axios.post(
      `${API_KEY_SERVICE_URL}/${req.tenantId}/generate-api-key`,
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
      : { message: "Error connecting to the API Key Management Service" };
    res.status(status).json(data);
  }
});

// Route to revoke an API key for a specific tenant (secured route)
router.delete(
  "/:tenantId/revoke-api-key/:key",
 
  async (req, res) => {
    try {
      const response = await axios.delete(
        `${API_KEY_SERVICE_URL}/${req.tenantId}/revoke-api-key/${req.params.key}`,
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
        : { message: "Error connecting to the API Key Management Service" };
      res.status(status).json(data);
    }
  }
);

module.exports = router;
