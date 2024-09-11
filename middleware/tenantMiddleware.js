const axios = require("axios");

const TENANT_SERVICE_URL =
  process.env.TENANT_SERVICE_URL || "http://localhost:5000/api/v1/tenants";

const tenantMiddleware = async (req, res, next) => {
  const tenantId = req.header("X-Tenant-Id");
  const token = req.header("Authorization")?.split(" ")[1];

  console.log("[tenantMiddleware] Validating tenant:", tenantId);

  if (!tenantId) {
    return res.status(400).json({ error: "X-Tenant-Id header is required" });
  }

  try {
    // Make a request to the Tenant Management Service's verify-tenant endpoint
    const response = await axios.get(`${TENANT_SERVICE_URL}/verify-tenant`, {
      headers: {
        "X-Tenant-Id": tenantId,
        Authorization: `Bearer ${token}`, // Include the token if necessary
      },
    });

    if (response.status === 200 && response.data.isValid) {
      console.log("[tenantMiddleware] Tenant is valid.");
      req.tenantId = tenantId;
      next();
    } else {
      console.error("[tenantMiddleware] Invalid tenant ID.");
      return res.status(401).json({ error: "Invalid tenant ID." });
    }
  } catch (error) {
    console.error("[tenantMiddleware] Error validating tenant:", error.message);
    const status = error.response ? error.response.status : 500;
    const data = error.response
      ? error.response.data
      : { error: "Error connecting to the Tenant Service" };
    return res.status(status).json(data);
  }
};

module.exports = tenantMiddleware;
