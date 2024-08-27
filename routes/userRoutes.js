const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const USERS_SERVICE_URL =
  process.env.USERS_SERVICE_URL || "http://localhost:5000/api/users";

// Apply the tenant middleware to all routes that include :tenantId
router.use(tenantMiddleware);

// Function to get headers for each request
const getHeaders = (tenantId, token = null, contentType = null) => {
  const headers = {
    "X-Tenant-Id": tenantId,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
};

// Public routes (No auth required)
router.post("/:tenantId/register", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/register`;
    const headers = getHeaders(
      req.params.tenantId,
      null,
      req.header("Content-Type")
    );
    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

router.post("/:tenantId/login", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/login`;
    const headers = getHeaders(
      req.params.tenantId,
      null,
      req.header("Content-Type")
    );
    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

router.get("/:tenantId/verify-email/:token", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/verify-email/${req.params.token}`;
    const headers = getHeaders(req.params.tenantId);
    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Protected routes (Require auth)
router.get(
  "/:tenantId/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const tenantId = req.params.tenantId;
      const userId = req.user.userId; // This should be set by the authMiddleware

      const user = await User.findOne({ _id: userId, tenant: tenantId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);



// Update a user's profile
router.get(
  "/:tenantId/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const tenantId = req.params.tenantId;
      const userId = req.user.userId; // This should be set by the authMiddleware

      // Fetch the user by ID and tenant
      const user = await User.findOne({ _id: userId, tenant: tenantId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
);

// Change user password
router.post("/:tenantId/change-password", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const url = `${USERS_SERVICE_URL}/${tenantId}/change-password`;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const headers = getHeaders(tenantId, token, req.header("Content-Type"));
    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding change password request:", error.message);
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
    const headers = getHeaders(
      req.params.tenantId,
      null,
      req.header("Content-Type")
    );
    const response = await axios.post(url, req.body, { headers });
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
    const headers = getHeaders(
      req.params.tenantId,
      null,
      req.header("Content-Type")
    );
    const response = await axios.post(url, req.body, { headers });
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
    const tenantId = req.params.tenantId;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const url = `${USERS_SERVICE_URL}/${tenantId}/logout`;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const headers = getHeaders(tenantId, token);
    const response = await axios.post(url, req.body, { headers });
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
    const headers = getHeaders(req.params.tenantId);
    const response = await axios.get(url, {
      headers,
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
    const headers = getHeaders(
      req.params.tenantId,
      null,
      req.header("Content-Type")
    );
    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Delete user
router.delete("/:tenantId/user/:userId", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const userId = req.params.userId;
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const url = `${USERS_SERVICE_URL}/${tenantId}/user/${userId}`;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    const headers = getHeaders(tenantId, token);
    const response = await axios.delete(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding delete user request:", error.message);
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
    const headers = {
      ...getHeaders(req.params.tenantId, null, req.header("Content-Type")),
    };
    const response = await axios.post(url, req.body, { headers });
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
