const express = require("express");
const router = express.Router();
const axios = require("axios");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");

const NEWSLETTER_SERVICE_URL =
  process.env.NEWSLETTER_SERVICE_URL || "http://localhost:5000/api/newsletters";

// Forward request to create a new newsletter
router.post("/", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${NEWSLETTER_SERVICE_URL}/`,
      { ...req.body, tenant: req.tenant }, // Pass the tenant object as part of the request body
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding newsletter creation request:",
      error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to get a newsletter by ID
router.get("/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${NEWSLETTER_SERVICE_URL}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding get newsletter by ID request:",
      error.message
    );
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});


// Forward request to update a newsletter
router.put("/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${NEWSLETTER_SERVICE_URL}/${req.params.id}`,
      req.body, // Pass the request body as it is
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding update newsletter request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to schedule a newsletter
router.post("/schedule/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${NEWSLETTER_SERVICE_URL}/schedule/${req.params.id}`,
      { ...req.body, tenant: req.tenant }, // Pass the tenant object as part of the request body
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding newsletter scheduling request:",
      error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to send a newsletter immediately
router.post("/send/:id", async (req, res) => {
  try {
    const response = await axios.post(
      `${NEWSLETTER_SERVICE_URL}/send/${req.params.id}`,
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
    console.error("Error forwarding send newsletter request:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to subscribe to newsletters
router.post("/subscribe", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${NEWSLETTER_SERVICE_URL}/subscribe`,
      req.body,
      {
        headers: {
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding subscribe request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to unsubscribe from newsletters
router.get("/unsubscribe", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${NEWSLETTER_SERVICE_URL}/unsubscribe`, {
      params: req.query,
      headers: {
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding unsubscribe request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to get all subscribers
router.get("/subscribers", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${NEWSLETTER_SERVICE_URL}/subscribers`, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding get all subscribers request:",
      error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
