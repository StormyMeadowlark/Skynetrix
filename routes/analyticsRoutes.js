const express = require("express");
const router = express.Router();
const axios = require("axios");

const ANALYTICS_SERVICE_URL =
  process.env.ANALYTICS_SERVICE_URL || "http://localhost:5001/api/analytics";

// Forward requests to record a view for a specific post
router.post("/record/:postId", async (req, res) => {
  try {
    const response = await axios.post(
      `${ANALYTICS_SERVICE_URL}/record/${req.params.postId}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding record view request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Analytics Service" };
    res.status(status).json(data);
  }
});

// Forward requests to get analytics data for a specific post
router.get("/post/:postId", async (req, res) => {
  try {
    const response = await axios.get(
      `${ANALYTICS_SERVICE_URL}/post/${req.params.postId}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get analytics request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Analytics Service" };
    res.status(status).json(data);
  }
});

// Forward requests to get all analytics data (admin-only)
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(ANALYTICS_SERVICE_URL, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get all analytics request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Analytics Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
