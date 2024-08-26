const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware")

const USERS_SERVICE_URL =
  process.env.USERS_SERVICE_URL || "http://localhost:5000/api/users";

// Apply the tenant middleware to all routes that include :tenantId
router.use(tenantMiddleware);
const getHeaders = (tenantId) => ({
  headers: {
    "X-Tenant-Id": tenantId,
  },
});
// Forward requests to User Management Service

// Register a new user
// Register a new user
router.post("/:tenantId/register", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/register`;
    const response = await axios.post(url, req.body, getHeaders(req.params.tenantId));
    res.status(response.status).json({
      message: "User registered and email sent successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error("Error forwarding registration request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the User Management Service" };
    res.status(status).json(data);
  }
});

// Login a user
router.post("/:tenantId/login", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/login`;
    const response = await axios.post(url, req.body, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Verify a user's email
router.get("/:tenantId/verify-email/:token", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/verify-email/${req.params.token}`;
    const response = await axios.get(url, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Get a user's profile
router.get("/:tenantId/profile", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/profile`;
    const response = await axios.get(url, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Update a user's profile
router.put("/:tenantId/profile", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/profile`;
    const response = await axios.put(url, req.body, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Change user password
router.post("/:tenantId/change-password", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/change-password`;
    const response = await axios.post(url, req.body, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Password reset
router.post("/:tenantId/forgot-password", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/forgot-password`;
    const response = await axios.post(url, req.body, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Reset password
router.post("/:tenantId/reset-password", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/reset-password`;
    const response = await axios.post(url, req.body, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Logout user
router.post("/:tenantId/logout", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/logout`;
    const response = await axios.post(
      url,
      req.body,
      getHeaders(req.params.tenantId)
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding logout request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Search for users
router.get("/:tenantId/search", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/search`;
    const response = await axios.get(url, {
      headers: getHeaders(req.params.tenantId).headers,
      params: req.query,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Resend verification email
router.post("/:tenantId/resend-verification-email", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/resend-verification-email`;
    const response = await axios.post(url, req.body, getHeaders(req.params.tenantId));
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Upload profile picture
router.post("/:tenantId/upload-profile-picture", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/upload-profile-picture`;
    const response = await axios.post(url, req.body, {
      headers: {
        ...getHeaders(req.params.tenantId).headers,
        "Content-Type": req.header("Content-Type"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
