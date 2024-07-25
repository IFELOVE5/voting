const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Invalid token format. It should start with 'Bearer '",
      });
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded) {
      return res.status(403).json({
        message: "Token verification failed",
      });
    }
    if (!decoded.isAdmin) {  return res.status(403).json({message: `you don't have authorized access`})   
       
        
    }
   
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
      error: error.message, // Provide detailed error message
    });
  }
};
