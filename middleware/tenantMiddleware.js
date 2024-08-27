module.exports = (req, res, next) => {
  console.log("Received headers:", req.headers); // Log all headers
  const tenantId = req.headers["x-tenant-id"];
  if (!tenantId) {
    return res.status(400).json({ message: "X-Tenant-Id header is required" });
  }
  req.tenantId = tenantId;
  next();
};
