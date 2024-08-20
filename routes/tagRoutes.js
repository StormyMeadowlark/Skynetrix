// routes/tagRoutes.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

const TAG_SERVICE_URL =
  process.env.TAG_SERVICE_URL || "http://localhost:5000/api/tags";

// Forward requests to Tag Management Service
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${TAG_SERVICE_URL}/`);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(`${TAG_SERVICE_URL}/`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${TAG_SERVICE_URL}/${req.params.id}`,
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
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${TAG_SERVICE_URL}/${req.params.id}`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Tag Management Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
