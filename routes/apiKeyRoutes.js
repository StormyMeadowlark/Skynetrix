// routes/apiKeyRoutes.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY_SERVICE_URL =
  process.env.API_KEY_SERVICE_URL || "http://localhost:5000/api/keys"; // Set this URL to point to your User Management Service

// Route to generate an API key for a specific tenant
router.post("/generate-api-key", async (req, res) => {
  try {
    const response = await axios.post(
      `${API_KEY_SERVICE_URL}/generate-api-key`,
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
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the User Management Service" };
    res.status(status).json(data);
  }
});

// Route to revoke an API key for a specific tenant
router.delete("/revoke-api-key/:key", async (req, res) => {
  try {
    const response = await axios.delete(
      `${API_KEY_SERVICE_URL}/revoke-api-key/${req.params.key}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the User Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
