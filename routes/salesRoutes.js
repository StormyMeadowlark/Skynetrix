const express = require("express");
const router = express.Router();
const axios = require("axios");
const authMiddleware = require("../middleware/authMiddleware");

// Utility function to forward requests to the Sales service
const forwardToSalesService = async (
  req,
  res,
  path,
  method = "GET",
  data = null
) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }

    const options = {
      method: method,
      url: `${process.env.SALES_SERVICE_URL}${path}`,
      headers: {
        Authorization: authToken,
        "x-tenant-id": tenantId,
      },
      ...(data && { data }),
    };

    const response = await axios(options);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      `[ERROR] Forwarding request to Sales Service: ${error.message}`
    );
    res
      .status(error.response?.status || 500)
      .json({
        message: error.response?.data?.message || "Internal Server Error",
      });
  }
};

// Add sale details for a vehicle (Admin, SuperAdmin, SalesRep)
router.post(
  "/:tenantId/:vehicleId",
  authMiddleware,
  async (req, res) => {
    await forwardToSalesService(
      req,
      res,
      `/${req.params.tenantId}/${req.params.vehicleId}`,
      "POST",
      req.body
    );
  }
);

// Get sale details for a specific vehicle (Admin, SuperAdmin, SalesRep)
router.get(
  "/:tenantId/:vehicleId",
  authMiddleware,
  async (req, res) => {
    await forwardToSalesService(
      req,
      res,
      `/${req.params.tenantId}/${req.params.vehicleId}`
    );
  }
);

// Update sale details (Admin, SuperAdmin)
router.patch(
  "/:tenantId/:vehicleId/:saleId",
  authMiddleware,
  async (req, res) => {
    await forwardToSalesService(
      req,
      res,
      `/${req.params.tenantId}/${req.params.vehicleId}/${req.params.saleId}`,
      "PATCH",
      req.body
    );
  }
);

// Delete a sale record (Admin, SuperAdmin)
router.delete(
  "/:tenantId/:vehicleId/:saleId",
  authMiddleware,
  async (req, res) => {
    await forwardToSalesService(
      req,
      res,
      `/${req.params.tenantId}/${req.params.vehicleId}/${req.params.saleId}`,
      "DELETE"
    );
  }
);

// Get all sales for a tenant (Admin, SuperAdmin, SalesRep)
router.get(
  "/:tenantId",
  authMiddleware,
  async (req, res) => {
    await forwardToSalesService(req, res, `/${req.params.tenantId}`);
  }
);

// Filter sales by status (Admin, SuperAdmin, SalesRep)
router.get(
  "/:tenantId/status/:status",
  authMiddleware,
  async (req, res) => {
    await forwardToSalesService(
      req,
      res,
      `/${req.params.tenantId}/status/${req.params.status}`
    );
  }
);



module.exports = router;
