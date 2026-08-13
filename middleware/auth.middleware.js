const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      // success: false,
      // message: "Token Missing",
        result: "error",
      error: "Token Missing",
    });
  }

  try {

    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();

  } catch {

    return res.status(401).json({
      // success: false,
      // message: "Invalid Token",
       result: "error",
      error: "Invalid Token",
    });

  }

};