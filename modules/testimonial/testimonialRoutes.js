const express = require("express");
const router = express.Router();
const TestimonialController = require("./testimonialController");
const TestimonialService = require("./testimonialService");
const upload = require("./uploadMiddleware");
const { setAdminIfValid } = require("../../middleware/requireAdmin");
const { requireOwnerOrAdmin, loadTestimonial } = require("../../middleware/testimonialAuth");

// Public: list all testimonials (anyone, including admin)
router.get("/", TestimonialController.getAll);

// Public: create testimonial (include email in form to update/delete later with same email)
router.post("/", upload.single("image"), TestimonialController.create);

// Owner (same email as when created) or Admin: update testimonial (form-data: email + optional image + fields)
router.patch(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  upload.single("image"),
  requireOwnerOrAdmin,
  TestimonialController.update,
);

// Owner (same email as when created) or Admin: delete testimonial
router.delete(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  requireOwnerOrAdmin,
  TestimonialController.delete,
);

module.exports = router;
