const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data"); // Import form-data package
const fs = require("fs"); // To handle file buffers
const authMiddleware = require("../middleware/authMiddleware");

const VEHICLE_MEDIA_SERVICE_URL =
  process.env.VEHICLE_MEDIA_SERVICE_URL || "http://localhost:4000/api/media";

// Set up Multer for handling file uploads (used in the gateway to forward files)
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// **1. Upload photos/documents for a vehicle**
router.post(
  "/:tenantId",
  authMiddleware,
  upload.array("media", 40), // Accept multiple files with the field name "media"
  async (req, res) => {
    try {
      const url = `${VEHICLE_MEDIA_SERVICE_URL}/${req.params.tenantId}`;
      const headers = getHeaders(
        req.params.tenantId,
        req.header("Authorization")
      );

      // Create form-data object and append files
      const formData = new FormData();
      req.files.forEach((file) => {
        formData.append("media", file.buffer, file.originalname); // Append file buffer with filename
      });

      // Axios config for multipart/form-data
      const axiosConfig = {
        headers: {
          ...headers,
          ...formData.getHeaders(), // Include form-data headers
        },
      };

      // Forward the request to the vehicle media service
      const response = await axios.post(url, formData, axiosConfig);

      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error uploading media" };
      res.status(status).json(data);
    }
  }
);
router.post(
  "/:tenantId/:vehicleId",
  authMiddleware,
  upload.array("media", 40), // Accept multiple files with the field name "media"
  async (req, res) => {
    try {
      const url = `${VEHICLE_MEDIA_SERVICE_URL}/${req.params.tenantId}/${req.params.vehicleId}`;
      const headers = getHeaders(
        req.params.tenantId,
        req.header("Authorization")
      );

      // Create form-data object and append files
      const formData = new FormData();
      req.files.forEach((file) => {
        formData.append("media", file.buffer, file.originalname); // Append file buffer with filename
      });

      // Axios config for multipart/form-data
      const axiosConfig = {
        headers: {
          ...headers,
          ...formData.getHeaders(), // Include form-data headers
        },
      };

      // Forward the request to the vehicle media service
      const response = await axios.post(url, formData, axiosConfig);

      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error uploading media" };
      res.status(status).json(data);
    }
  }
);
// **2. Get all photos/documents for a vehicle**
router.get("/:tenantId/:vehicleId", async (req, res) => {
  try {
    const url = `${VEHICLE_MEDIA_SERVICE_URL}/${req.params.tenantId}/${req.params.vehicleId}`;
    const headers = getHeaders(
      req.params.tenantId,
    );

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error fetching media" };
    res.status(status).json(data);
  }
});

// **3. Delete a photo/document**
router.delete("/:tenantId/:mediaId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_MEDIA_SERVICE_URL}/${req.params.tenantId}/${req.params.mediaId}`;
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
      : { message: "Error deleting media" };
    res.status(status).json(data);
  }
});

// **4. Get all media for a tenant**
router.get("/:tenantId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_MEDIA_SERVICE_URL}/${req.params.tenantId}`;
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
      : { message: "Error fetching tenant media" };
    res.status(status).json(data);
  }
});

// **5. Bulk assign media to a vehicle**
router.put("/:tenantId/assign/:vehicleId", authMiddleware, async (req, res) => {
  try {
    const url = `${VEHICLE_MEDIA_SERVICE_URL}/${req.params.tenantId}/assign/${req.params.vehicleId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    const response = await axios.put(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error assigning media to vehicle" };
    res.status(status).json(data);
  }
});

// **6. Upload media for a tenant**


module.exports = router;
