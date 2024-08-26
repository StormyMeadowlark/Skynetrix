// tenantMiddleware.js
module.exports = function tenantIdMiddleware(req, res, next) {
  const tenantId = req.params.tenantId;
  if (!tenantId) {
    return res.status(400).json({ message: "Tenant ID is required" });
  }
  req.tenantId = tenantId;
  next();
};
