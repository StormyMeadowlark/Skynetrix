const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const sharp = require("sharp");
const FormData = require("form-data");
// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Set limit to 10 MB
  },
}); // Create an instance of multer with the specified storage

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
    headers["Authorization"] = `${token}`;
  }

  return headers;
};

// Create a new vehicle (Admin and SuperAdmin only)
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

// Get all vehicles for a tenant (Admin, SuperAdmin, Mechanic, Viewer)
router.get("/:tenantId", async (req, res) => {
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

// Get details for a specific vehicle (Admin, Mechanic, Viewer, User)
router.get("/:tenantId/:vehicleId", async (req, res) => {
  try {
    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}/${req.params.vehicleId}`;
    const headers = getHeaders(req.params.tenantId);

    // Send the request to the vehicle service
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

// Update a vehicle (Admin, SuperAdmin, Mechanic only)
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

// Delete a vehicle (Admin and SuperAdmin only)
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

// Soft delete a vehicle (Admin and SuperAdmin only)
router.delete(
  "/:tenantId/:vehicleId/soft-delete",
  authMiddleware,
  async (req, res) => {
    try {
      const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}/${req.params.vehicleId}/soft-delete`;
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
  }
);

// Extract and decode VIN from image (Admin and SuperAdmin only)
router.post(
  "/:tenantId/extract-and-decode-vin",
  upload.array("images"),
  async (req, res) => {
    try {
      const tenantId = req.params.tenantId;
      const url = `${VEHICLE_SERVICE_URL}/${tenantId}/extract-and-decode-vin`;

      // Ensure files are uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const formData = new FormData();

      // Add each uploaded file to the FormData
      for (const file of req.files) {
        // Ensure that the buffer is correctly formatted for FormData
        formData.append("images", file.buffer, {
          filename: file.originalname, // Set the original filename
          contentType: file.mimetype, // Set the file MIME type
        });
      }

      const headers = getHeaders(
        req.params.tenantId,
        req.header("Authorization")
      );

      // Send the request to the vehicle service
      const response = await axios.post(url, formData, {
        headers: {
          ...headers,
          ...formData.getHeaders(), // Include FormData headers
        },
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error processing extract-and-decode-vin:", error);

      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Vehicle Service" };

      res.status(status).json(data);
    }
  }
);



// Decode VIN manually entered by user (Admin and SuperAdmin only)
router.post("/:tenantId/decode-vin", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_SERVICE_URL}/${req.params.tenantId}/decode-vin`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

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

module.exports = router;
