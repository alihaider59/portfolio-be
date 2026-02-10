const jwt = require("jsonwebtoken");

function isAdminToken(secret, provided) {
  if (!secret || !provided) return false;
  if (provided === secret) return true;
  try {
    const decoded = jwt.verify(provided, secret);
    return decoded && decoded.role === "admin";
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return res.status(503).json({ status: "fail", message: "Admin auth not configured." });
  }
  const provided =
    req.headers["x-admin-secret"] ||
    (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, "").trim());
  if (!isAdminToken(secret, provided)) {
    return res.status(403).json({ status: "fail", message: "Admin access required." });
  }
  req.isAdmin = true;
  next();
}

function setAdminIfValid(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  const provided =
    req.headers["x-admin-secret"] ||
    (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, "").trim());
  req.isAdmin = isAdminToken(secret, provided);
  next();
}

module.exports = {
  requireAdmin,
  setAdminIfValid,
};
