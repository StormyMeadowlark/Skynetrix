const express = require("express");
const router = express.Router();
const axios = require("axios");
const tenantMiddleware = require("../middleware/tenantMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
dotenv.config();

const NEWSLETTER_SERVICE_URL =
  process.env.NEWSLETTER_SERVICE_URL || "http://localhost:5000/api/newsletters";

// Function to get headers for each request
const getHeaders = (tenantId, token = null, contentType = null) => {
  const headers = {
    "x-tenant-id": tenantId,
  };

  if (token) {
    headers["Authorization"] = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
};
// Apply tenant middleware to all routes that include :tenantId


// Create a new newsletter
router.post("/:tenantId", async (req, res) => {
  try {
    const url = `NEWSLETTER_SERVICE_URL/${req.params.tenantId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization"),
      req.header("Content-Type")
    );

    console.log("[CREATE NEWSLETTER] Forwarding request to:", url);
    console.log("[CREATE NEWSLETTER] Headers:", headers);
    console.log("[CREATE NEWSLETTER] Body:", req.body);

    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding create newsletter request:", error.message);

    if (error.response) {
      console.error(
        "[CREATE NEWSLETTER] Error response data:",
        error.response.data
      );
      console.error(
        "[CREATE NEWSLETTER] Error response status:",
        error.response.status
      );
    } else {
      console.error("[CREATE NEWSLETTER] No response from Newsletter Service");
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Update an existing newsletter
router.put("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization"),
      req.header("Content-Type")
    );

    console.log("[UPDATE NEWSLETTER] Forwarding request to:", url);
    console.log("[UPDATE NEWSLETTER] Headers:", headers);
    console.log("[UPDATE NEWSLETTER] Body:", req.body);

    const response = await axios.put(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding update newsletter request:", error.message);

    if (error.response) {
      console.error(
        "[UPDATE NEWSLETTER] Error response data:",
        error.response.data
      );
      console.error(
        "[UPDATE NEWSLETTER] Error response status:",
        error.response.status
      );
    } else {
      console.error("[UPDATE NEWSLETTER] No response from Newsletter Service");
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Delete a newsletter
router.delete(
  "/:tenantId/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`;
      const headers = getHeaders(
        req.params.tenantId,
        req.header("Authorization")
      );

      console.log("[DELETE NEWSLETTER] Forwarding request to:", url);
      console.log("[DELETE NEWSLETTER] Headers:", headers);

      const response = await axios.delete(url, { headers });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        "Error forwarding delete newsletter request:",
        error.message
      );

      if (error.response) {
        console.error(
          "[DELETE NEWSLETTER] Error response data:",
          error.response.data
        );
        console.error(
          "[DELETE NEWSLETTER] Error response status:",
          error.response.status
        );
      } else {
        console.error(
          "[DELETE NEWSLETTER] No response from Newsletter Service"
        );
      }

      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Get a newsletter by ID
router.get("/:tenantId/:id", authMiddleware, async (req, res) => {
  try {
    const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    console.log("[GET NEWSLETTER] Forwarding request to:", url);
    console.log("[GET NEWSLETTER] Headers:", headers);

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get newsletter request:", error.message);

    if (error.response) {
      console.error(
        "[GET NEWSLETTER] Error response data:",
        error.response.data
      );
      console.error(
        "[GET NEWSLETTER] Error response status:",
        error.response.status
      );
    } else {
      console.error("[GET NEWSLETTER] No response from Newsletter Service");
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Get all newsletters
router.get("/:tenantId", authMiddleware, async (req, res) => {
  try {
    const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    console.log("[GET ALL NEWSLETTERS] Forwarding request to:", url);
    console.log("[GET ALL NEWSLETTERS] Headers:", headers);

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding get all newsletters request:",
      error.message
    );

    if (error.response) {
      console.error(
        "[GET ALL NEWSLETTERS] Error response data:",
        error.response.data
      );
      console.error(
        "[GET ALL NEWSLETTERS] Error response status:",
        error.response.status
      );
    } else {
      console.error(
        "[GET ALL NEWSLETTERS] No response from Newsletter Service"
      );
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Newsletter Service" };
    res.status(status).json(data);
  }
});

// Send a newsletter
router.post(
  "/:tenantId/:id/send",
  authMiddleware,
  async (req, res) => {
    try {
      const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/${req.params.id}/send`;
      const headers = getHeaders(
        req.params.tenantId,
        req.header("Authorization"),
        req.header("Content-Type")
      );

      console.log("[SEND NEWSLETTER] Forwarding request to:", url);
      console.log("[SEND NEWSLETTER] Headers:", headers);
      console.log("[SEND NEWSLETTER] Body:", req.body);

      const response = await axios.post(url, req.body, { headers });
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding send newsletter request:", error.message);

      if (error.response) {
        console.error(
          "[SEND NEWSLETTER] Error response data:",
          error.response.data
        );
        console.error(
          "[SEND NEWSLETTER] Error response status:",
          error.response.status
        );
      } else {
        console.error(
          "[SEND NEWSLETTER] No response from Send Newsletter Service"
        );
      }

      const status = error.response ? error.response.status : 500;
      const data = error.response
        ? error.response.data
        : { message: "Error connecting to Send Newsletter Service" };
      res.status(status).json(data);
    }
  }
);

// Subscribe a user
router.post("/:tenantId/subscribe", tenantMiddleware, async (req, res) => {
  try {
    const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/subscribe`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization"),
      req.header("Content-Type")
    );

    console.log("[SUBSCRIBE USER] Forwarding request to:", url);
    console.log("[SUBSCRIBE USER] Headers:", headers);
    console.log("[SUBSCRIBE USER] Body:", req.body);

    const response = await axios.post(url, req.body, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding subscribe user request:", error.message);

    if (error.response) {
      console.error(
        "[SUBSCRIBE USER] Error response data:",
        error.response.data
      );
      console.error(
        "[SUBSCRIBE USER] Error response status:",
        error.response.status
      );
    } else {
      console.error("[SUBSCRIBE USER] No response from Subscriber Service");
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

// Unsubscribe a user
router.post("/:tenantId/unsubscribe/", tenantMiddleware, async (req, res) => {
  try {
    // Construct the URL to forward the request to the newsletter service
    const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/unsubscribe`;

    // Get headers from the helper function
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    console.log("[UNSUBSCRIBE USER] Forwarding request to:", url);
    console.log("[UNSUBSCRIBE USER] Headers:", headers);
    console.log("[UNSUBSCRIBE USER] Body:", req.body); // Ensure the request body is logged

    // Forward the request to the newsletter service
    const response = await axios.post(url, req.body, { headers }); // Include the body with the headers

    // Return the response from the newsletter service
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding unsubscribe user request:", error.message);

    if (error.response) {
      console.error(
        "[UNSUBSCRIBE USER] Error response data:",
        error.response.data
      );
      console.error(
        "[UNSUBSCRIBE USER] Error response status:",
        error.response.status
      );
    } else {
      console.error("[UNSUBSCRIBE USER] No response from Subscriber Service");
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

// Get all subscribers
router.get("/:tenantId/subscribers", authMiddleware, async (req, res) => {
  try {
    const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/subscribers`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    console.log("[GET ALL SUBSCRIBERS] Forwarding request to:", url);
    console.log("[GET ALL SUBSCRIBERS] Headers:", headers);

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error forwarding get all subscribers request:",
      error.message
    );

    if (error.response) {
      console.error(
        "[GET ALL SUBSCRIBERS] Error response data:",
        error.response.data
      );
      console.error(
        "[GET ALL SUBSCRIBERS] Error response status:",
        error.response.status
      );
    } else {
      console.error(
        "[GET ALL SUBSCRIBERS] No response from Subscriber Service"
      );
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

// Get a subscriber by ID
router.get("/:tenantId/subscribers/:id", authMiddleware, async (req, res) => {
  try {
    const url = `${NEWSLETTER_SERVICE_URL}/${req.params.tenantId}/${req.params.id}`;
    const headers = getHeaders(
      req.params.tenantId,
      req.header("Authorization")
    );

    console.log("[GET SUBSCRIBER] Forwarding request to:", url);
    console.log("[GET SUBSCRIBER] Headers:", headers);

    const response = await axios.get(url, { headers });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error forwarding get subscriber request:", error.message);

    if (error.response) {
      console.error(
        "[GET SUBSCRIBER] Error response data:",
        error.response.data
      );
      console.error(
        "[GET SUBSCRIBER] Error response status:",
        error.response.status
      );
    } else {
      console.error("[GET SUBSCRIBER] No response from Subscriber Service");
    }

    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to Subscriber Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
