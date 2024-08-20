const express = require("express");
const router = express.Router();
const axios = require("axios");

const CATEGORY_SERVICE_URL =
  process.env.CATEGORY_SERVICE_URL || "http://localhost:5000/api/categories";

// Forward requests to get all categories
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(CATEGORY_SERVICE_URL, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding get all categories request:",
      error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Category Service" };
    res.status(status).json(data);
  }
});

// Forward requests to create a new category
router.post("/", async (req, res) => {
  try {
    const response = await axios.post(CATEGORY_SERVICE_URL, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding create category request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Category Service" };
    res.status(status).json(data);
  }
});

// Forward requests to update a category
router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${CATEGORY_SERVICE_URL}/${req.params.id}`,
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
    console.error("Error forwarding update category request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Category Service" };
    res.status(status).json(data);
  }
});

// Forward requests to delete a category
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${CATEGORY_SERVICE_URL}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding delete category request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Category Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
