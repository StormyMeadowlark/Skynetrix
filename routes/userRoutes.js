const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware"); 

const USERS_SERVICE_URL =
  process.env.USERS_SERVICE_URL || "http://localhost:5000/api/users";

// Apply the tenant middleware to all routes that include :tenantId
router.use(tenantMiddleware);

// Forward requests to User Management Service

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.tenantId}/register`;
    const response = await axios.post(url, req.body);
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
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${USERS_SERVICE_URL}/${req.tenantId}/login`,
      req.body
    );
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
router.get("/verify-email/:token", async (req, res) => {
  try {
    const response = await axios.get(
      `${USERS_SERVICE_URL}/${req.tenantId}/verify-email/${req.params.token}`
    );
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
router.get("/profile", async (req, res) => {
  try {
    const response = await axios.get(
      `${USERS_SERVICE_URL}/${req.tenantId}/profile`,
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
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Update a user's profile
router.put("/profile", async (req, res) => {
  try {
    const response = await axios.put(
      `${USERS_SERVICE_URL}/${req.tenantId}/profile`,
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
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${USERS_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Generate an API key for a user
router.post("/generate-api-key/:userId", async (req, res) => {
  try {
    const response = await axios.post(
      `${USERS_SERVICE_URL}/${req.tenantId}/generate-api-key/${req.params.userId}`,
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
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Change a user's password
router.put("/change-password", async (req, res) => {
  try {
    const response = await axios.put(
      `${USERS_SERVICE_URL}/${req.tenantId}/change-password`,
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
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forgot password request
router.post("/forgot-password", async (req, res) => {
  try {
    const response = await axios.post(
      `${USERS_SERVICE_URL}/${req.tenantId}/forgot-password`,
      req.body
    );
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
router.post("/reset-password", async (req, res) => {
  try {
    const response = await axios.post(
      `${USERS_SERVICE_URL}/${req.tenantId}/reset-password`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Logout a user
router.post("/logout", async (req, res) => {
  try {
    console.log("Logout request received in API Gateway");
    console.log("Authorization Header:", req.header("Authorization"));

    const response = await axios.post(
      `${USERS_SERVICE_URL}/${req.tenantId}/logout`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
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
router.get("/search", async (req, res) => {
  try {
    const response = await axios.get(
      `${USERS_SERVICE_URL}/${req.tenantId}/search`,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
        params: req.query,
      }
    );
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
router.post("/resend-verification-email", async (req, res) => {
  try {
    const response = await axios.post(
      `${USERS_SERVICE_URL}/${req.tenantId}/resend-verification-email`,
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
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Upload profile picture
router.post("/upload-profile-picture", async (req, res) => {
  try {
    const response = await axios.post(
      `${USERS_SERVICE_URL}/${req.tenantId}/upload-profile-picture`,
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
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
