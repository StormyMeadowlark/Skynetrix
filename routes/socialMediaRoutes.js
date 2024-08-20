// routes/socialMediaRoutes.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

const SOCIAL_MEDIA_SERVICE_URL =
  process.env.SOCIAL_MEDIA_SERVICE_URL ||
  "http://localhost:5000/api/social-media";

// Forward requests to Social Media Management Service
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(
      `${SOCIAL_MEDIA_SERVICE_URL}/`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${SOCIAL_MEDIA_SERVICE_URL}/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

router.post("/schedule/:id", async (req, res) => {
  try {
    const response = await axios.post(
      `${SOCIAL_MEDIA_SERVICE_URL}/schedule/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

router.post("/publish/:id", async (req, res) => {
  try {
    const response = await axios.post(
      `${SOCIAL_MEDIA_SERVICE_URL}/publish/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Social Media Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
