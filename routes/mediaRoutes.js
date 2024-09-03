const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");
const authMiddleware = require("../middleware/authMiddleware");

const MEDIA_SERVICE_URL =
  process.env.MEDIA_SERVICE_URL || "http://localhost:5001/api/media";

// Apply multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Helper function for forwarding requests
const forwardRequest = async (req, res, method, url) => {
  try {
    if (
      method === "post" &&
      req.headers["content-type"].startsWith("multipart/form-data")
    ) {
      // Handle file upload using FormData
      const formData = new FormData();

      if (req.file) {
        // Add the file to the FormData object
        formData.append("file", req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });

        const headers = {
          ...formData.getHeaders(),
          Authorization: req.headers["authorization"],
          "x-tenant-id": req.headers["x-tenant-id"],
        };

        const response = await axios({
          method,
          url,
          headers,
          data: formData,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 120000, // Increase timeout to 120 seconds
        });

        res.status(response.status).json(response.data);
      } else {
        console.error("No file found in the request.");
        return res.status(400).json({ message: "No file uploaded." });
      }
    } else {
      // For non-file requests
      const response = await axios({
        method,
        url,
        headers: req.headers,
        data: req.body,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000,
      });

      res.status(response.status).json(response.data);
    }
  } catch (error) {
    console.error(
      `[ERROR] ${method.toUpperCase()} request failed:`,
      error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      message: error.response
        ? error.response.data
        : "Error connecting to Media Service",
    });
  }
};

// Route to upload media - apply multer middleware to handle file upload
router.post("/:tenantId/upload", upload.single("file"), async (req, res) => {
  console.log("Forwarding upload request to backend...");
  const url = `${MEDIA_SERVICE_URL}/upload`;
  await forwardRequest(req, res, "post", url);
});

// Route to update media metadata (like size)
router.put("/:tenantId/update", authMiddleware, async (req, res) => {
  console.log("Forwarding media metadata update request to backend...");
  const url = `${MEDIA_SERVICE_URL}/update`;
  await forwardRequest(req, res, "put", url);
});

// Route to get all media
router.get("/:tenantId/", authMiddleware, async (req, res) => {
  const url = `${MEDIA_SERVICE_URL}/tenant/${req.params.tenantId}/`;
  await forwardRequest(req, res, "get", url);
});

// Route to get media by ID
router.get("/:tenantId/:id", authMiddleware, async (req, res) => {
  const url = `${MEDIA_SERVICE_URL}/${req.params.id}`;
  await forwardRequest(req, res, "get", url);
});

// Route to delete media by ID
router.delete("/:tenantId/:id", authMiddleware, async (req, res) => {
  const url = `${MEDIA_SERVICE_URL}/${req.params.id}`;
  await forwardRequest(req, res, "delete", url);
});

module.exports = router;
