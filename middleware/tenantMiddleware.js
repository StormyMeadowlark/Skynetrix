const axios = require("axios");

const tenantMiddleware = async (req, res, next) => {
  const domain = req.headers.host.split(":")[0]; // Extract the domain from the request
  const tenantIdHeader = req.header("x-tenant-id");

  let tenantId = tenantIdHeader;

  // Determine the tenant ID based on the domain if not provided in the header
  if (!tenantId) {
    try {
      // Try to fetch the tenant information based on the domain
      const response = await axios.get(
        `${process.env.TENANT_SERVICE_URL}/tenants/domain/${domain}`
      );
      const tenant = response.data;

      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found." });
      }

      tenantId = tenant._id; // Use the tenant's ID from the database
    } catch (error) {
      console.error("Error fetching tenant by domain:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  try {
    // Fetch the tenant information based on the tenant ID
    const response = await axios.get(
      `${process.env.TENANT_SERVICE_URL}/tenants/${tenantId}`
    );
    const tenant = response.data;

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    req.tenant = tenant; // Attach tenant information to the request
    next();
  } catch (error) {
    console.error("Error fetching tenant information:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = tenantMiddleware;