// routes/tenantRoutes.js

const express = require("express");
const router = express.Router();
const axios = require("axios");

const TENANT_SERVICE_URL =
  process.env.TENANT_SERVICE_URL || "http://localhost:5000/api/tenants"; // Adjust the URL to point to your Tenant Management Service

// Forward request to create a tenant
router.post("/", async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}`;
    console.log("Creating tenant with data:", req.body);
    const response = await axios.post(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error details:",
      error.response ? error.response.data : error.message
    );
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Forward request to get all tenants
router.get("/", async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Forward request to get a specific tenant by ID
router.get("/:id", async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Forward request to update a tenant
router.put("/:id", async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.put(url, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

// Forward request to delete a tenant
router.delete("/:id", async (req, res) => {
  try {
    const url = `${TENANT_SERVICE_URL}/${req.params.id}`;
    const response = await axios.delete(url, {
      headers: {
        Authorization: req.header("Authorization"),
        "x-api-key": req.header("x-api-key"),
      },
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { message: "Error connecting to the Tenant Service" };
    res.status(status).json(data);
  }
});

module.exports = router;
