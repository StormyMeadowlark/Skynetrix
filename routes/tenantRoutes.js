const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");



const TENANT_SERVICE_URL =
  process.env.TENANT_SERVICE_URL || "http://localhost:5000/api/v1/tenants";



// Routes for Tenant Management Service


router.get("/verify-tenant", async (req, res) => {
  try {
    const tenantIdHeader = req.header("x-tenant-id");

    if (!tenantIdHeader) {
      console.error("x-tenant-id header is missing.");
      return res
        .status(400)
        .json({ error: "Bad Request: Missing x-tenant-id header." });
    }

    console.log(
      "Forwarding request to Tenant Management Service for tenant ID:",
      tenantIdHeader
    );

    // Forward the request to the Tenant Management Service's verify-tenant endpoint
    const response = await axios.get(`${TENANT_SERVICE_URL}/verify-tenant`, {
      headers: {
        "x-tenant-id": tenantIdHeader,
      },
    });

    console.log("Tenant verification successful:", response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error during tenant verification:", error.message);

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});
// Apply the auth middleware globally to all routes that require authentication
router.use(authMiddleware);
// Create a tenant (requires SuperAdmin role)
router.post("/", async (req, res) => {
  try {
    console.log("Starting tenant creation through API Gateway...");

    // Check for required headers
    const authHeader = req.header("Authorization");
    const tenantIdHeader = req.header("x-tenant-id");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Authorization header is missing or improperly formatted.");
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing or malformed token." });
    }

    if (!tenantIdHeader) {
      console.error("x-tenant-id header is missing.");
      return res
        .status(400)
        .json({ error: "Bad Request: Missing x-tenant-id header." });
    }

    const url = `${TENANT_SERVICE_URL}`;
    console.log("Target URL:", url);
    console.log("Request Body:", req.body);
    console.log("Authorization Header:", authHeader);
    console.log("x-tenant-id Header:", tenantIdHeader);

    const response = await axios.post(url, req.body, {
      headers: {
        Authorization: authHeader,
        "x-tenant-id": tenantIdHeader,
      },
    });

    console.log("Tenant created successfully:", response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error during tenant creation in API Gateway:",
      error.message
    );

    if (error.response) {
      // Log the response details if available
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});
// Get all tenants
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "SuperAdmin") {
      console.log("Access denied: User is not a SuperAdmin.");
      return res.status(403).json({ error: "Access denied: SuperAdmin only." });
    }

    const url = `${TENANT_SERVICE_URL}`;
    console.log("Fetching all tenants from:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-tenant-id": req.header("x-tenant-id"),
      },
    });

    console.log("Successfully fetched all tenants.");
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error details in get all tenants:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Get a specific tenant by ID
router.get("/:id", tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    console.log("Fetching tenant with ID:", req.params.id);

    const response = await axios.get(url, {
      headers: {
        "x-tenant-id": req.header("x-tenant-id"),
      },
    });

    console.log("Successfully fetched tenant:", req.params.id);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error details in get tenant by ID:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Update a tenant (requires tenant ID)
router.put("/:id", authMiddleware, tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    console.log("Updating tenant with ID:", req.params.id);

    const response = await axios.put(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-tenant-id": req.header("x-tenant-id"),
      },
    });

    console.log("Successfully updated tenant:", req.params.id);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error details in update tenant:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Delete a tenant (requires tenant ID)
router.delete("/:id", authMiddleware, tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    console.log("Deleting tenant with ID:", req.params.id);

    const response = await axios.delete(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-tenant-id": req.header("x-tenant-id"),
      },
    });

    console.log("Successfully deleted tenant:", req.params.id);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error details in delete tenant:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Get all tenants
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "SuperAdmin") {
      return res.status(403).json({ error: "Access denied: SuperAdmin only." });
    }

    const url = `${TENANT_SERVICE_URL}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-tenant-id": req.header("x-tenant-id"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error details in get all tenants:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Get a specific tenant by ID
router.get("/:id", tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-tenant-id": req.header("x-tenant-id"), // Include x-tenant-id header
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

// Update a tenant (requires tenant ID)
router.put("/:id", tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.put(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-tenant-id": req.header("x-tenant-id"), // Include x-tenant-id header
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

// Delete a tenant (requires tenant ID)
router.delete("/:id", tenantMiddleware, async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-tenant-id": req.header("x-tenant-id"), // Include x-tenant-id header
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

// Regenerate API key for a specific tenant (requires tenant ID)
router.post(
  "/regenerate-api-key/:tenantId",
  tenantMiddleware,
  async (req, res) => {
    try {
      const url = `${TENANT_SERVICE_URL}/regenerate-api-key/${req.params.tenantId}`;
      const response = await axios.post(url, req.body, {
        headers: {
          Authorization: req.header("Authorization"),
          "x-tenant-id": req.header("x-tenant-id"), // Include x-tenant-id header
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
