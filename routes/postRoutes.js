const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware")

const POST_SERVICE_URL =
  process.env.POST_SERVICE_URL || "http://localhost:5000/api/posts";

// Forward request to create a new post
// routes/postRoutes.js or the equivalent file where the post creation is handled
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Token being sent:", req.header("Authorization"));

    const requestBody = req.body;

    const response = await axios.post(`${POST_SERVICE_URL}/`, requestBody, {
      headers: {
        Authorization: req.header("Authorization"), // Forwarding the token
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding create post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to get all posts (published)
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${POST_SERVICE_URL}/`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get all posts request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to get a post by ID
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${POST_SERVICE_URL}/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get post by ID request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to update a post
router.put("/:id", async (req, res) => {
  try {
    const response = await axios.put(
      `${POST_SERVICE_URL}/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding update post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to delete a post
router.delete("/:id", async (req, res) => {
  try {
    const response = await axios.delete(
      `${POST_SERVICE_URL}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding delete post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to publish a post
router.post("/:id/publish", async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.params.id}/publish`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding publish post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to unpublish a post
router.post("/:id/unpublish", async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.params.id}/unpublish`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding unpublish post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to like a post
router.post("/:postId/like", async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.params.postId}/like`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding like post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

// Forward request to dislike a post
router.post("/:postId/dislike", async (req, res) => {
  try {
    const response = await axios.post(
      `${POST_SERVICE_URL}/${req.params.postId}/dislike`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding dislike post request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Post Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
