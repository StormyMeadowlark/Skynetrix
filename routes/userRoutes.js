const express = require("express");
const router = express.Router();
const axios = require("axios");

const USERS_SERVICE_URL =
  process.env.USERS_SERVICE_URL ||
  "http://localhost:5000/api/users"; // Update this URL to match your setup

// Forward requests to User Management Service
router.post("/register", async (req, res) => {
  try {
    const url = `${USERS_SERVICE_URL}/register`;

    // Forward the registration request to the User Management Service
    const response = await axios.post(url, req.body);

    // Send success response back to the client
    res.status(response.status).json({
      message: "User registered and email sent successfully.",
      data: response.data,
    });
  } catch (error) {
    // Enhanced error logging
    console.error("Error forwarding registration request:", error);

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the User Management Service" };

    // Return the error response to the client
    res.status(status).json(data);
  }
});



// Forward requests for logging in a user
router.post("/login", async (req, res) => {
  try {
    const response = await axios.post(`${USERS_SERVICE_URL}/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for verifying email
router.get("/verify-email/:token", async (req, res) => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/verify-email/${req.params.token}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for getting user profile
router.get("/profile", async (req, res) => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/profile`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for updating user profile
router.put("/profile", async (req, res) => {
  try {
    const response = await axios.put(`${USERS_SERVICE_URL}/profile`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for deleting a user
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${USERS_SERVICE_URL}/${req.params.id}`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for generating API keys for users
router.post("/generate-api-key/:userId", async (req, res) => {
  try {
    const response = await axios.post(`${USERS_SERVICE_URL}/generate-api-key/${req.params.userId}`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for changing user password
router.put("/change-password", async (req, res) => {
  try {
    const response = await axios.put(`${USERS_SERVICE_URL}/change-password`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const response = await axios.post(`${USERS_SERVICE_URL}/forgot-password`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for password reset verification
router.post("/reset-password", async (req, res) => {
  try {
    const response = await axios.post(`${USERS_SERVICE_URL}/reset-password`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for user logout
router.post("/logout", async (req, res) => {
  try {
    // Log the incoming request details for debugging
    console.log("Logout request received in API Gateway");
    console.log("Authorization Header:", req.header("Authorization"));

    const response = await axios.post(`${USERS_SERVICE_URL}/logout`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });

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


// Forward requests for searching users
router.get("/search", async (req, res) => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/search`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
      params: req.query,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for resending verification email
router.post("/resend-verification-email", async (req, res) => {
  try {
    const response = await axios.post(`${USERS_SERVICE_URL}/resend-verification-email`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

// Forward requests for uploading profile pictures
router.post("/upload-profile-picture", async (req, res) => {
  try {
    const response = await axios.post(`${USERS_SERVICE_URL}/upload-profile-picture`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "Content-Type": req.header("Content-Type"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to User Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
