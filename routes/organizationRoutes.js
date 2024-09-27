const express = require("express");
const axios = require("axios");
const router = express.Router();
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const ORGANIZATION_SERVICE_URL =
  process.env.ORGANIZATION_SERVICE_URL ||
  "http://localhost:5000/api/organizations"; // Adjust the URL as necessary

// Apply tenant middleware to all routes that include :tenantId
router.use(tenantMiddleware);

// Function to get headers for each request
const getHeaders = (tenantId, token = null) => {
  const headers = {
    "X-Tenant-Id": tenantId,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Create a new organization
router.post("/:tenantId", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log incoming request body

    // Validate input data
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required." });
    }

    const url = `${ORGANIZATION_SERVICE_URL}/${req.params.tenantId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    // Log headers being sent
    console.log("Headers sent to organization service:", headers);

    const response = await axios.post(url, req.body, { headers });

    console.log("Response from organization service:", response.data); // Log the response from the service
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error creating organization:", error); // Log the error
    const status = error.response ? error.response.status : 500;
    res
      .status(status)
      .json({ error: "Error creating organization", details: error.message });
  }
});

// Get all organizations for a tenant
router.get(
  "/:tenantId/organizations",
  async (req, res) => {
    try {
      const url = `${ORGANIZATION_SERVICE_URL}/${req.params.tenantId}/organizations`;
      const headers = getHeaders(
        req.params.tenantId,
        req.header("Authorization")
      );

      const response = await axios.get(url, { headers });

      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      res.status(status).json({ error: "Error fetching organizations" });
    }
  }
);

// Get an organization by ID
router.get("/:tenantId/:id", async (req, res) => {
  try {
    const url = `${ORGANIZATION_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.get(url, { headers });

    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Error fetching organization" });
  }
});

// Update an organization
router.put("/:tenantId/:id", async (req, res) => {
  try {
    const url = `${ORGANIZATION_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.put(url, req.body, { headers });

    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Error updating organization" });
  }
});

// Delete an organization
router.delete("/:tenantId/:id", async (req, res) => {
  try {
    const url = `${ORGANIZATION_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.delete(url, { headers });

    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    res.status(status).json({ error: "Error deleting organization" });
  }
});

module.exports = router;
