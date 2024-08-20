const express = require("express");
const router = express.Router();
const axios = require("axios");

const ADMIN_SERVICE_URL =
  process.env.ADMIN_SERVICE_URL || "http://localhost:5001/api/v1/admin"; // Replace with your actual admin service URL

// Forward requests to Admin Service
router.use("/", async (req, res) => {
  try {
    const url = `${ADMIN_SERVICE_URL}${req.url}`;
    const method = req.method.toLowerCase();

    const headers = {
      Authorization: req.header("Authorization"),
      "x-api-key": req.header("x-api-key"),
    };

    const options = {
      headers,
      data: req.body, // Request body for POST/PUT
    };

    const response = await axios[method](url, options);
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Admin Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
