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
//works on localhost:3000
router.post("/:tenantId/login", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/${req.params.tenantId}/login`; // Construct the URL for the User Management Service
    const headers = getHeaders(
      req.params.tenantId,
      null,
      req.header("Content-Type") // Set headers, including content type
    );

    const response = await axios.post(url, req.body, { headers }); // Forward request to User Management Service
    res.status(response.status).json(response.data); // Respond with the result
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});



router.get("/:tenantId/profile", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const authorization = req.header("Authorization"); // Forward the Authorization header

    // Log incoming request details
    console.log("Received request to fetch user profile:");
    console.log("Tenant ID from URL:", tenantId);
    console.log("Authorization header:", authorization);

    // Headers to be forwarded to the user management service
    const headers = {
      Authorization: authorization,
      "x-tenant-id": tenantId,
    };

    // Log the headers that will be forwarded
    console.log("Forwarding headers to User Management Service:", headers);

    const url = `${USERS_SERVICE_URL}/${tenantId}/profile`;
    console.log("Request URL for User Management Service:", url);

    // Forward the request to the user management service
    const response = await axios.get(url, { headers });

    // Log the response status and data
    console.log(
      "Response from User Management Service:",
      response.status,
      response.data
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error details
    console.error("Error in API Gateway:", error.message);

    if (error.response) {
      console.error(
        "Error response from User Management Service:",
        error.response.data
      );
      console.error(
        "Status code from User Management Service:",
        error.response.status
      );
    } else {
      console.error("No response received from User Management Service.");
    }

    const status = error.response ? error.response.status : 500;
    res
      .status(status)
      .json({ error: "Error connecting to User Management Service" });
  }
});

// Update a user's profile
router.put("/:tenantId/profile", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const authorization = req.header("Authorization"); // Forward the Authorization header

    // Log incoming request details
    console.log("Received request to update user profile:");
    console.log("Tenant ID from URL:", tenantId);
    console.log("Authorization header:", authorization);

    // Headers to be forwarded to the user management service
    const headers = {
      Authorization: authorization,
      "x-tenant-id": tenantId,
    };

    // Log the headers that will be forwarded
    console.log("Forwarding headers to User Management Service:", headers);

    const url = `${USERS_SERVICE_URL}/${tenantId}/profile`;
    console.log("Request URL for User Management Service:", url);

    // Forward the request to the user management service
    const response = await axios.put(url, req.body, { headers });

    // Log the response status and data
    console.log(
      "Response from User Management Service:",
      response.status,
      response.data
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error details
    console.error("Error in API Gateway:", error.message);

    if (error.response) {
      console.error(
        "Error response from User Management Service:",
        error.response.data
      );
      console.error(
        "Status code from User Management Service:",
        error.response.status
      );
    } else {
      console.error("No response received from User Management Service.");
    }

    const status = error.response ? error.response.status : 500;
    res
      .status(status)
      .json({ error: "Error connecting to User Management Service" });
  }
});



// Change user password
router.post("/:tenantId/change-password", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;
    const authorization = req.header("Authorization");

    // Forward headers to user management service
    const headers = {
      Authorization: authorization,
      "x-tenant-id": tenantId,
    };

    const url = `${USERS_SERVICE_URL}/${tenantId}/change-password`;
    const response = await axios.post(url, req.body, { headers });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error in change password route:", error.message);
    const status = error.response ? error.response.status : 500;
    res
      .status(status)
      .json({ error: "Error connecting to User Management Service" });
  }
});

router.post("/:tenantId/forgot-password", async (req, res) => {
  const tenantId = req.params.tenantId;
  console.log("Received forgot password request for tenant:", tenantId);
  try {
    const url = `${USERS_SERVICE_URL}/${tenantId}/forgot-password`;
    const headers = getHeaders(tenantId, null, req.header("Content-Type"));

    console.log("Sending forgot password request to:", url);
    console.log("Request headers:", headers);
    console.log("Request body:", req.body);

    const response = await axios.post(url, req.body, { headers });

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error during forgot password request:", error.message);

    if (error.response) {
      console.error("Error response data:", error.response.data);
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };

    res.status(status).json(data);
  }
});

// Reset password
router.post("/:tenantId/reset-password/:token", async (req, res) => {
  const tenantId = req.params.tenantId;
  const token = req.params.token;

  // Log received tenant ID and token
  console.log("Received reset password request for tenant:", tenantId);
  console.log("Received reset token:", token);

  // Check if tenantId or token is missing
  if (!tenantId || !token) {
    return res
      .status(400)
      .json({ message: "Tenant ID and Token are required." });
  }

  try {
    // Construct the URL for the user service (dynamically fetch USERS_SERVICE_URL if necessary)
    const url = `${USERS_SERVICE_URL}/${tenantId}/reset-password/${token}`;

    // Ensure the x-tenant-id header is included
    const headers = {
      "x-tenant-id": tenantId,
      "Content-Type": req.header("Content-Type") || "application/json", // Default to JSON if not provided
    };

    // Log the URL, headers, and request body for debugging
    console.log("Sending reset password request to:", url);
    console.log("Request headers:", headers);
    console.log("Request body:", req.body);

    // Make the request to the user management service
    const response = await axios.post(url, req.body, { headers });

    // Log the response from the user service
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    // Return the same response from the user service
    return res.status(response.status).json(response.data);
  } catch (error) {
    // Log the error details for debugging
    console.error("Error during reset password request:", error.message);

    if (error.response) {
      console.error("Error response data:", error.response.data);
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to User Management Service" };

    // Return error response
    return res.status(status).json(data);
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







//untested routes

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
