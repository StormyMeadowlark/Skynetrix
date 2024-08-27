const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const authMiddleware = require("../middleware/authMiddleware"); // Import the auth middleware
const tenantMiddleware = require("../middleware/tenantMiddleware"); // Import the tenant middleware

const NEWSLETTER_SERVICE_URL =
  process.env.NEWSLETTER_SERVICE_URL || "http://localhost:5000/api/newsletters";
const SUBSCRIBER_SERVICE_URL =
  process.env.SUBSCRIBER_SERVICE_URL || "http://localhost:5000/api/subscribers";
const SEND_NEWSLETTER_SERVICE_URL =
  process.env.SEND_NEWSLETTER_SERVICE_URL ||
  "http://localhost:5000/api/send-newsletter";

// Apply tenantMiddleware globally to ensure all routes are tenant-specific
router.use("/:tenantId/*", tenantMiddleware);

// Forward request to create a new newsletter (secured route)
router.post("/:tenantId/newsletters", async (req, res) => {
  try {
    const response = await axios.post(
      `${NEWSLETTER_SERVICE_URL}/${req.tenantId}/`,
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
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Forward request to update a newsletter (secured route)
router.put(
  "/:tenantId/newsletters/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.put(
        `${NEWSLETTER_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
      console.error(
        "Error forwarding update newsletter request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to delete a newsletter (secured route)
router.delete(
  "/:tenantId/newsletters/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.delete(
        `${NEWSLETTER_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
        "Error forwarding delete newsletter request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get a newsletter by ID (secured route)
router.get(
  "/:tenantId/newsletters/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${NEWSLETTER_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get all newsletters (secured route)
router.get(
  "/:tenantId/newsletters",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${NEWSLETTER_SERVICE_URL}/${req.tenantId}/`,
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
        "Error forwarding get all newsletters request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to search newsletters (secured route)
router.get(
  "/:tenantId/newsletters/search",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${NEWSLETTER_SERVICE_URL}/${req.tenantId}/search`,
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
      console.error(
        "Error forwarding search newsletters request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to send a newsletter (secured route)
router.post(
  "/:tenantId/newsletters/:id/send",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${SEND_NEWSLETTER_SERVICE_URL}/${req.tenantId}/send/${req.params.id}`,
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
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Send Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to schedule a newsletter (secured route)
router.post(
  "/:tenantId/newsletters/:id/schedule",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${NEWSLETTER_SERVICE_URL}/${req.tenantId}/${req.params.id}/schedule`,
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
      console.error(
        "Error forwarding schedule newsletter request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to subscribe a user (secured route)
router.post(
  "/:tenantId/subscribers",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${SUBSCRIBER_SERVICE_URL}/${req.tenantId}/`,
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
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Subscriber Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to unsubscribe a user (secured route)
router.delete(
  "/:tenantId/subscribers/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.delete(
        `${SUBSCRIBER_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Subscriber Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get all subscribers (secured route)
router.get(
  "/:tenantId/subscribers",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${SUBSCRIBER_SERVICE_URL}/${req.tenantId}/`,
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
        "Error forwarding get all subscribers request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Subscriber Service" };
      res.status(status).json(data);
    }
  }
);

// Forward request to get a subscriber by ID (secured route)
router.get(
  "/:tenantId/subscribers/:id",

  apiKeyMiddleware,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${SUBSCRIBER_SERVICE_URL}/${req.tenantId}/${req.params.id}`,
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
        "Error forwarding get subscriber by ID request:",
        error.message
      );
      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Subscriber Service" };
      res.status(status).json(data);
    }
  }
);

module.exports = router;
