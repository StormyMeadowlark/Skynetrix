const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  // Check if token is present and properly formatted
  if (!token || !token.startsWith("Bearer ")) {
    console.log("[AUTH] No token provided or malformed token.");
    return res.status(401).json({ error: "No token provided." });
  }

  const actualToken = token.split(" ")[1];

  jwt.verify(actualToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("[AUTH] JWT verification error:", err);
      return res.status(401).json({ error: "Invalid token." });
    }

    // Log the decoded token payload for debugging
    console.log("[AUTH] JWT verified successfully. Decoded payload:", decoded);

    // Attach user details to the request object
    req.user = { userId: decoded.userId, tenantId: decoded.tenantId };

    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;
