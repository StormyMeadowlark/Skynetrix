const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    console.error("API key missing in request.");
    return res.status(403).json({ message: "Forbidden: API key missing" });
  }

  try {
    console.log("Received API Key:", apiKey);

    // Adjust the query to search for the API key in the root level apiKey field
    const tenant = await Tenant.findOne({ apiKey: apiKey });

    if (!tenant) {
      console.error(`Invalid API key: ${apiKey}`);
      return res.status(403).json({ message: "Forbidden: Invalid API key" });
    }

    // Log the full tenant object
    console.log("Tenant object:", JSON.stringify(tenant, null, 2));

    // Proceed with the request if the API key is valid
    req.tenant = tenant;
    next();
  } catch (error) {
    console.error("Error during API key validation:", error);
    res
      .status(500)
      .json({ message: "Server error occurred during API key validation" });
  }
};

module.exports = apiKeyMiddleware;
