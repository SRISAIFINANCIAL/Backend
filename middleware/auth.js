// const jwt = require("jsonwebtoken");

// function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Missing authorization" });
//   }
//   const token = authHeader.split(" ")[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = payload; // contains e.g. username and id
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// }

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // ✅ Allow browser CORS preflight requests
  if (req.method === "OPTIONS") {
    return next();
  }

  // ✅ Read Authorization header
  const authHeader = req.headers.authorization;

  // ❌ No token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization" });
  }

  // ✅ Extract token
  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin info to request
    req.admin = payload; // { id, username, iat, exp }

    next();
  } catch (err) {
    // ❌ Invalid / expired token
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
