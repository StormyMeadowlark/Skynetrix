const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

const ADMIN_SERVICE_URL =
  process.env.ADMIN_SERVICE_URL || "http://localhost:5001/api/v1/admin";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Example of a more expansive route list with specific endpoints

// Route to get admin dashboard data (Admin-Only)
router.get(
  "/:tenantId/dashboard",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${ADMIN_SERVICE_URL}/${req.tenantId}/dashboard`;
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
        : { message: "Error connecting to the Admin Service" };
      res.status(status).json(data);
    }
  }
);

// Route to manage users (Admin-Only)
router.post(
  "/:tenantId/users",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${ADMIN_SERVICE_URL}/${req.tenantId}/users`;
      const response = await axios.post(url, req.body, {
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
        : { message: "Error connecting to the Admin Service" };
      res.status(status).json(data);
    }
  }
);

// Route to update user details (Admin-Only)
router.put(
  "/:tenantId/users/:userId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${ADMIN_SERVICE_URL}/${req.tenantId}/users/${req.params.userId}`;
      const response = await axios.put(url, req.body, {
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
        : { message: "Error connecting to the Admin Service" };
      res.status(status).json(data);
    }
  }
);

// Route to delete a user (Admin-Only)
router.delete(
  "/:tenantId/users/:userId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${ADMIN_SERVICE_URL}/${req.tenantId}/users/${req.params.userId}`;
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
        : { message: "Error connecting to the Admin Service" };
      res.status(status).json(data);
    }
  }
);

// Route to manage settings (Admin-Only)
router.post(
  "/:tenantId/settings",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${ADMIN_SERVICE_URL}/${req.tenantId}/settings`;
      const response = await axios.post(url, req.body, {
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
        : { message: "Error connecting to the Admin Service" };
      res.status(status).json(data);
    }
  }
);

// Route to update settings (Admin-Only)
router.put(
  "/:tenantId/settings/:settingId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${ADMIN_SERVICE_URL}/${req.tenantId}/settings/${req.params.settingId}`;
      const response = await axios.put(url, req.body, {
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
        : { message: "Error connecting to the Admin Service" };
      res.status(status).json(data);
    }
  }
);

// Route to delete a setting (Admin-Only)
router.delete(
  "/:tenantId/settings/:settingId",
  authMiddleware,
  apiKeyMiddleware,
  async (req, res) => {
    try {
      const url = `${ADMIN_SERVICE_URL}/${req.tenantId}/settings/${req.params.settingId}`;
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
        : { message: "Error connecting to the Admin Service" };
      res.status(status).json(data);
    }
  }
);

// Catch-all route to forward other requests to Admin Service
router.use("/", async (req, res) => {
  try {
    const url = `${ADMIN_SERVICE_URL}${req.url}`;
    const method = req.method.toLowerCase();

    const headers = {
      Authorization: req.header("Authorization"),
      "x-api-key": req.header("x-api-key"),
    };

    const options = {
      headers,
      data: req.body, // Request body for POST/PUT
    };

    const response = await axios[method](url, options);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Admin Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
