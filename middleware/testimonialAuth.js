function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function requireOwnerOrAdmin(req, res, next) {
  if (req.isAdmin) return next();
  // Prefer body (when user enters email in a form on update/delete), then header, then query
  const provided =
    (req.body && (req.body.email || req.body.ownerEmail)) ||
    req.headers["x-owner-email"] ||
    (req.query && (req.query.email || req.query.ownerEmail));
  const ownerEmail = normalizeEmail(provided);
  if (!ownerEmail) {
    return res.status(403).json({
      status: "fail",
      message: "Email required to verify ownership. Send the same email you used when creating this testimonial in the request body: { email: \"your@email.com\" }.",
    });
  }
  const testimonial = req.testimonial;
  if (!testimonial) {
    return res.status(403).json({ status: "fail", message: "Not authorized to modify this testimonial." });
  }
  if (!testimonial.email) {
    return res.status(403).json({
      status: "fail",
      message: "This testimonial has no owner email; only admin can modify it.",
    });
  }
  if (normalizeEmail(testimonial.email) !== ownerEmail) {
    return res.status(403).json({ status: "fail", message: "Email does not match. Use the same email you used when creating this testimonial." });
  }
  next();
}

function loadTestimonial(TestimonialService) {
  return (req, res, next) => {
    TestimonialService.getById(req.params.id)
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ status: "fail", message: "Testimonial not found." });
        }
        req.testimonial = doc;
        next();
      })
      .catch(next);
  };
}

module.exports = {
  requireOwnerOrAdmin,
  loadTestimonial,
};
