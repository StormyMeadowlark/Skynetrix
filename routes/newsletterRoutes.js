const express = require("express");
const router = express.Router();
const axios = require("axios");
const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const dotenv = require("dotenv")
dotenv.config()
const NEWSLETTER_SERVICE_URL = process.env.NEWSLETTER_SERVICE_URL || "http://localhost:5000/api/newsletters";
const tenantMiddleware =  require("../middleware/tenantMiddleware")
// Forward request to create a new newsletter
router.post("/newsletters", tenantMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${NEWSLETTER_SERVICE_URL}/`,
      req.body,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding create newsletter request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to update a newsletter
router.put("/newsletters/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${NEWSLETTER_SERVICE_URL}/`,
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
    console.error("Error forwarding update newsletter request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});
// Forward request to delete a newsletter
router.delete("/newsletters/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
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
    console.error("Error forwarding delete newsletter request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to get a newsletter by ID
router.get("/newsletters/:id", apiKeyMiddleware, async (req, res) => {
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
    console.error("Error forwarding get newsletter by ID request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to get all newsletters
router.get("/newsletters", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${NEWSLETTER_SERVICE_URL}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get all newsletters request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to search newsletters
router.get("/newsletters/search", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${NEWSLETTER_SERVICE_URL}/search`,
      {
        params: req.query,
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding search newsletters request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to send a newsletter
// Middleware to attach tenant info and forward request
router.use('/newsletters/:id/send', async (req, res) => {
  try {
    const tenantId = req.header('x-tenant-id');
    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    // Attach tenant-specific details to the request body
    const requestBody = {
      ...req.body,
      verifiedSenderEmail: tenant.verifiedSenderEmail,
      encryptedApiKey: tenant.encryptedApiKey,
    };

    const response = await axios.post(`${SEND_NEWSLETTER_SERVICE_URL}/send`, requestBody, {
      headers: {
        Authorization: req.header('Authorization'),
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error forwarding send newsletter request:', error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: 'Error connecting to Send Newsletter Service' };
    res.status(status).json(data);
  }
});

module.exports = router;

// Forward request to schedule a newsletter
router.post("/newsletters/:id/schedule", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${NEWSLETTER_SERVICE_URL}/${req.params.id}/schedule`,
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
    console.error("Error forwarding schedule newsletter request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to subscribe a user
router.post("/subscribers", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${SUBSCRIBER_SERVICE_URL}`,
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
    console.error("Error forwarding subscribe request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

// Forward request to unsubscribe a user
router.delete("/subscribers/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
      `${SUBSCRIBER_SERVICE_URL}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding unsubscribe request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

// Forward request to get all subscribers
router.get("/subscribers", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${SUBSCRIBER_SERVICE_URL}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get all subscribers request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

// Forward request to get a subscriber by ID
router.get("/subscribers/:id", apiKeyMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${SUBSCRIBER_SERVICE_URL}/${req.params.id}`,
      {
        headers: {
          Authorization: req.header("Authorization"),
          "x-api-key": req.header("x-api-key"),
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get subscriber by ID request:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
