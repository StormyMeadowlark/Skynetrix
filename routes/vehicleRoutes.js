const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const VEHICLE_SERVICE_URL =
  process.env.VEHICLE_SERVICE_URL || "http://localhost:4000/api/vehicles";

// Middleware for tenant validation
router.use(tenantMiddleware);

// Function to get headers for each request
const getHeaders = (tenantId, token = null) => {
  const headers = {
    "x-tenant-id": tenantId,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Create a new vehicle
router.post("/:tenantId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    // Forward the request to the vehicle service
    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Vehicle Service" };
    res.status(status).json(data);
  }
});

// Get all vehicles for a tenant
router.get("/:tenantId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.get(url, {
      headers,
      params: req.query, // Pass query params (e.g., pagination, filters)
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Vehicle Service" };
    res.status(status).json(data);
  }
});

// Get details for a specific vehicle
router.get("/:tenantId/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}/${req.params.vehicleId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Vehicle Service" };
    res.status(status).json(data);
  }
});

// Update a vehicle
router.patch("/:tenantId/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}/${req.params.vehicleId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.patch(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Vehicle Service" };
    res.status(status).json(data);
  }
});

// Delete a vehicle
router.delete("/:tenantId/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}/${req.params.vehicleId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.delete(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Vehicle Service" };
    res.status(status).json(data);
  }
});

router.get("/:tenantId/public/vehicles", async (req, res) => {
  try {
    // Forward query parameters like sortBy, page, etc.
    const { sortBy, sortOrder = "asc", page = 1, limit = 10 } = req.query;

    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}`;
    const headers = getHeaders(req.params.tenantId);

    // Forward the request to the backend, adding the saleStatus filter
    const response = await axios.get(url, {
      headers,
      params: {
        ...req.query,
        saleStatus: "forSale", // Always filter by vehicles for sale
      },
    });

    // Return the response from the backend
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Vehicle Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
