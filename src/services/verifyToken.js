const jwt = require("jsonwebtoken");
const logger = require("../../utils/logger");

// Middleware for admin token verification
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    logger.info("ADMIN TOKEN: Missing token");
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decodedToken = token.replace("Bearer ", ""); // Remove "Bearer " prefix
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user object to the request

    // Check if the user is an admin
    if (decoded.isAdmin) {
      // User is an admin
      logger.info("ADMIN TOKEN: Token verification successful");
      next();
    } else {
      // User is not an admin
      logger.info("ADMIN TOKEN: Access denied - User is not an admin");
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    logger.error(`ADMIN TOKEN: Invalid token - ${error}`);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware for non-admin token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    logger.info("TOKEN: Missing token");
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decodedToken = token.replace("Bearer ", ""); // Remove "Bearer " prefix
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user object to the request
    logger.info("TOKEN: Token verification successful");
    next();
  } catch (error) {
    logger.error(`TOKEN: Invalid token - ${error}`);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyAdminToken, verifyToken };
