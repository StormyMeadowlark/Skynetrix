const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
dotenv.config();

// Base URL for the Email Service in the CMS backend
const EMAIL_SERVICE_URL =
  process.env.EMAIL_SERVICE_URL || "http://localhost:5001/api/email";

// Function to get headers for forwarding requests
const getHeaders = (tenantId, token = null, contentType = null) => {
  const headers = {
    "x-tenant-id": tenantId,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
};

// Apply tenant middleware to all routes
router.use("/:tenantId/*", tenantMiddleware);

// Create a new email template
router.post("/:tenantId/templates", authMiddleware, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const headers = getHeaders(
      tenantId,
      req.header("Authorization"),
      req.header("Content-Type")
    );
    const url = `${EMAIL_SERVICE_URL}/${tenantId}/templates`;

    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding create email template request:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Error forwarding request to email service." });
  }
});

// Get all email templates for a tenant
router.get("/:tenantId/templates", authMiddleware, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const headers = getHeaders(tenantId, req.header("Authorization"));
    const url = `${EMAIL_SERVICE_URL}/${tenantId}/templates`;

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding get all email templates request:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Error forwarding request to email service." });
  }
});

// Get a specific email template by ID
router.get(
  "/:tenantId/:templateId/templates",
  authMiddleware,
  async (req, res) => {
    try {
      const { tenantId, templateId } = req.params;
      const headers = getHeaders(tenantId, req.header("Authorization"));
      const url = `${EMAIL_SERVICE_URL}/${tenantId}/${templateId}/templates`;

      const response = await axios.get(url, { headers });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding get email template by ID request:",
        error.message
      );
      res
        .status(500)
        .json({ error: "Error forwarding request to email service." });
    }
  }
);

// Update an email template
router.put(
  "/:tenantId/:templateId/templates",
  authMiddleware,
  async (req, res) => {
    try {
      const { tenantId, templateId } = req.params;
      const headers = getHeaders(
        tenantId,
        req.header("Authorization"),
        req.header("Content-Type")
      );
      const url = `${EMAIL_SERVICE_URL}/${tenantId}/${templateId}/templates`;

      const response = await axios.put(url, req.body, { headers });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding update email template request:",
        error.message
      );
      res
        .status(500)
        .json({ error: "Error forwarding request to email service." });
    }
  }
);

// Delete an email template
router.delete(
  "/:tenantId:templateId/templates/",
  authMiddleware,
  async (req, res) => {
    try {
      const { tenantId, templateId } = req.params;
      const headers = getHeaders(tenantId, req.header("Authorization"));
      const url = `${EMAIL_SERVICE_URL}/${tenantId}/${templateId}/templates`;

      const response = await axios.delete(url, { headers });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding delete email template request:",
        error.message
      );
      res
        .status(500)
        .json({ error: "Error forwarding request to email service." });
    }
  }
);

router.post("/:tenantId/contact", async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { name, email, message } = req.body; // Extract contact form data from request body

    // Basic validation of form data
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "All fields (name, email, message) are required." });
    }

    // Prepare headers
    const headers = getHeaders(tenantId, null, "application/json");

    // Define the URL for the contact email endpoint in the email service
    const url = `${EMAIL_SERVICE_URL}/${tenantId}/contact`;

    // Forward the contact form data to the email service
    const response = await axios.post(
      url,
      { name, email, message },
      { headers }
    );

    // Respond with the status and data from the email service
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding contact form request:", error.message);
    res
      .status(500)
      .json({ error: "Error forwarding request to email service." });
  }
});


module.exports = router;
