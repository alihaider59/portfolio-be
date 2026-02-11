const crypto = require("crypto");
const { getOwned } = require("../utils/testimonialCookie");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function requireOwner(req, res, next) {
  const testimonial = req.testimonial;
  if (!testimonial) {
    return res.status(403).json({
      status: "fail",
      message: "Not authorized.",
    });
  }

  // Admin can update/delete without the edit token
  if (req.isAdmin) {
    return next();
  }

  // Cookie-based ownership: same browser that submitted is allowed without link/token
  const owned = getOwned(req);
  const idStr = testimonial._id.toString();
  const cookieEntry = owned.find((e) => e.id === idStr);
  if (cookieEntry && testimonial.token) {
    const hashedCookie = hashToken(cookieEntry.token);
    const hashedStored = hashToken(testimonial.token);
    if (hashedCookie === hashedStored) {
      return next();
    }
  }

  const providedToken =
    req.headers["x-edit-token"] ||
    (req.query && req.query.token) ||
    (req.body && req.body.token);

  if (!providedToken) {
    return res.status(403).json({
      status: "fail",
      message: "Use the same browser where you submitted, or use your edit link.",
    });
  }

  if (!testimonial.token) {
    return res.status(403).json({
      status: "fail",
      message: "Invalid edit token.",
    });
  }

  const hashedIncoming = hashToken(providedToken);
  const hashedStored = hashToken(testimonial.token);

  if (hashedIncoming !== hashedStored) {
    return res.status(403).json({
      status: "fail",
      message: "Invalid edit token.",
    });
  }

  next();
}

function loadTestimonial(TestimonialService) {
  return (req, res, next) => {
    TestimonialService.getById(req.params.id)
      .then((doc) => {
        if (!doc) {
          return res
            .status(404)
            .json({ status: "fail", message: "Testimonial not found." });
        }
        req.testimonial = doc;
        next();
      })
      .catch(next);
  };
}

module.exports = {
  requireOwner,
  loadTestimonial,
};
