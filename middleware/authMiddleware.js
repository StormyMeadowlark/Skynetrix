const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Token expired:", err);
        return res.status(401).json({ error: "Token expired." });
      }
      console.log("JWT verification error:", err);
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = decoded; // Attach the decoded token payload to req.user
    next();
  });
};

module.exports = authMiddleware;
