const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware"); // Adjust path as necessary
const tenantMiddleware = require("../middleware/tenantMiddleware"); // Adjust path as necessary

const TENANT_SERVICE_URL =
  process.env.TENANT_SERVICE_URL || "http://localhost:5000/api/tenants";

// Apply the auth middleware globally to all routes that require authentication
router.use(authMiddleware);

// Routes for Tenant Management Service

// Create a tenant (likely an admin action)
router.post("/", async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}`;
    const response = await axios.post(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Get all tenants (likely an admin action)
router.get("/", async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Get a specific tenant by ID (requires tenant ID, so use tenantMiddleware)
router.get("/:id", tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Update a tenant (requires tenant ID, so use tenantMiddleware)
router.put("/:id", tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.put(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Delete a tenant (requires tenant ID, so use tenantMiddleware)
router.delete("/:id", tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Regenerate API key for a specific tenant (requires tenant ID, so use tenantMiddleware)
router.post(
  "/regenerate-api-key/:tenantId",
  tenantMiddleware,
  async (req, res) => {
    try {
      const url = `${TENANT_SERVICE_URL}/regenerate-api-key/${req.params.tenantId}`;
      const response = await axios.post(url, req.body, {
        headers: {
          Authorization: req.header("Authorization"),
        },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding API key regeneration request:", error);
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to the Tenant Management Service" };
      res.status(status).json(data);
    }
  }
);

module.exports = router;
