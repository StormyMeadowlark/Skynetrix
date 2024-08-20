// routes/mediaRoutes.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

const UM_MEDIA_SERVICE_URL =
  process.env.UM_MEDIA_SERVICE_URL || "http://localhost:5000/api/media"; // Set this URL to point to your Media Service
const MEDIA_SERVICE_URL =
  process.env.MEDIA_SERVICE_URL || "http://localhost:5000/api/media";
// Route to upload media
router.post("/upload", async (req, res) => {
  try {
    const url = `${UM_MEDIA_SERVICE_URL}/upload`;
    const response = await axios.post(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
        "Content-Type": req.header("Content-Type"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Media Service" };
    res.status(status).json(data);
  }
});

// Route to get all media
router.get("/", async (req, res) => {
  try {
    const url = `${UM_MEDIA_SERVICE_URL}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Media Service" };
    res.status(status).json(data);
  }
});

// Route to get media by ID
router.get("/:id", async (req, res) => {
  try {
    const url = `${UM_MEDIA_SERVICE_URL}/${req.params.id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Media Service" };
    res.status(status).json(data);
  }
});

// Route to delete media by ID
router.delete("/:id", async (req, res) => {
  try {
    const url = `${UM_MEDIA_SERVICE_URL}/${req.params.id}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Media Service" };
    res.status(status).json(data);
  }
});
// Forward request to upload media
router.post("/upload", async (req, res) => {
  try {
    const response = await axios.post(
      `${MEDIA_SERVICE_URL}/upload`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "Content-Type": req.header("Content-Type"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding media upload request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Media Service" };
    res.status(status).json(data);
  }
});

// Forward request to get all media
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${MEDIA_SERVICE_URL}`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get all media request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Media Service" };
    res.status(status).json(data);
  }
});

// Forward request to get media by ID
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${MEDIA_SERVICE_URL}/${req.params.id}`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get media by ID request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Media Service" };
    res.status(status).json(data);
  }
});

// Forward request to delete media
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${MEDIA_SERVICE_URL}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding delete media request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Media Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
