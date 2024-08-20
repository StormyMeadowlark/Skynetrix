const express = require("express");
const router = express.Router();
const axios = require("axios");

const COMMENT_SERVICE_URL =
  process.env.COMMENT_SERVICE_URL || "http://localhost:5000/api/comments";

// Forward request to create a new comment
router.post("/:postId", async (req, res) => {
  try {
    const url = `${COMMENT_SERVICE_URL}/${req.params.postId}`;
    const response = await axios.post(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding create comment request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Comment Service" };
    res.status(status).json(data);
  }
});

// Forward request to get all comments for a post
router.get("/:postId", async (req, res) => {
  try {
    const url = `${COMMENT_SERVICE_URL}/${req.params.postId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get comments request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Comment Service" };
    res.status(status).json(data);
  }
});

// Forward request to delete a comment
router.delete("/:id", async (req, res) => {
  try {
    const url = `${COMMENT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding delete comment request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Comment Service" };
    res.status(status).json(data);
  }
});

// Forward request to update a comment
router.put("/:id", async (req, res) => {
  try {
    const url = `${COMMENT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.put(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding update comment request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Comment Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
