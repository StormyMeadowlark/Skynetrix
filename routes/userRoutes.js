const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware")

const USERS_SERVICE_URL =
  process.env.USERS_SERVICE_URL || "http://localhost:5000/api/users";

// Apply the tenant middleware to all routes that include :tenantId
router.use(tenantMiddleware);

// Login a user
router.post("/:tenantId/login", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const url = `${USERS_SERVICE_URL}/${tenantId}/login`;

    const response = await axios.post(url, req.body, getHeaders(tenantId));

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error forwarding login request for tenant ${tenantId}:`, error.message);

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };

    res.status(status).json(data);
  }
});

// Register a new user
router.post("/:tenantId/register", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const url = `${USERS_SERVICE_URL}/${tenantId}/register`;
    
    const response = await axios.post(url, req.body);
    
    res.status(response.status).json({
      message: "User registered and email sent successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error(`Error forwarding registration request for tenant ${tenantId}:`, error.message);
    
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
    const tenantId = req.params.tenantId;
    const token = req.params.token;
    const url = `${USERS_SERVICE_URL}/${tenantId}/verify-email/${token}`;

    const response = await axios.get(url, getHeaders(tenantId));

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error forwarding email verification request for tenant ${tenantId}:`, error.message);

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
    const tenantId = req.params.tenantId;
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token and remove 'Bearer ' prefix
    const url = `${USERS_SERVICE_URL}/${tenantId}/profile`;

    // Validate the presence of the token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Set up headers for the request to User Management Service
    const headers = {
      "X-Tenant-Id": tenantId,
      Authorization: `Bearer ${token}`, // Pass token in the Authorization header
    };

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get user profile request:", error.message);
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
    const tenantId = req.params.tenantId;
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token and remove 'Bearer ' prefix
    const url = `${USERS_SERVICE_URL}/${tenantId}/profile`;

    // Validate the presence of the token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Set up headers for the request to User Management Service
    const headers = {
      "X-Tenant-Id": tenantId,
      Authorization: `Bearer ${token}`, // Pass token in the Authorization header
    };

    // Make the PUT request
    const response = await axios.put(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding update user profile request:",
      error.message
    );
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
    const tenantId = req.params.tenantId;
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract and clean the token
    const url = `${USERS_SERVICE_URL}/${tenantId}/change-password`;

    // Ensure token is present
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Set up headers for the request to User Management Service
    const headers = {
      "X-Tenant-Id": tenantId,
      Authorization: `Bearer ${token}`, // Include token in the Authorization header
    };

    // Make the POST request
    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding change password request:", error.message);
    console.error(
      "Error details:",
      error.response ? error.response.data : "No response data"
    );
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
  const tenantId = req.params.tenantId;
  const token = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer ", "")
    : undefined;
  const url = `${USERS_SERVICE_URL}/${tenantId}/logout`;

  try {
    const response = await axios.post(
      url,
      req.body,
      getHeaders(tenantId, token) // Pass headers including Authorization token
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding logout request:", error.message);
    console.error(
      "Error details:",
      error.response ? error.response.data : "No response data"
    );
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
router.delete("/:tenantId/user/:userId", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const userId = req.params.userId;
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract and clean the token
    const url = `${USERS_SERVICE_URL}/${tenantId}/user/${userId}`;

    // Ensure token is present
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Set up headers for the request to User Management Service
    const headers = {
      "X-Tenant-Id": tenantId,
      Authorization: `Bearer ${token}`, // Include token in the Authorization header
    };

    // Make the DELETE request
    const response = await axios.delete(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding delete user request:", error.message);
    console.error(
      "Error details:",
      error.response ? error.response.data : "No response data"
    );
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
