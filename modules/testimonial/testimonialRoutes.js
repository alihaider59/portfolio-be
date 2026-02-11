const express = require("express");
const router = express.Router();

const TestimonialController = require("./testimonialController");
const TestimonialService = require("./testimonialService");
const upload = require("./uploadMiddleware");

const { setAdminIfValid } = require("../../middleware/requireAdmin");
const {
  requireOwner,
  loadTestimonial,
} = require("../../middleware/testimonialAuth");

// Public: list testimonials (includes isOwner when cookie present)
router.get("/", TestimonialController.getAll);

// Public: create testimonial (sets ownership cookie for this browser)
router.post("/", upload.single("image"), TestimonialController.create);

// Edit flow by token (optional link from email or bookmark) – must be before /:id
router.get("/edit/:token", TestimonialController.getByToken);
router.patch(
  "/edit/:token",
  upload.single("image"),
  TestimonialController.updateByToken,
);
router.delete("/edit/:token", TestimonialController.deleteByToken);

// Owner (cookie or token) OR Admin: get one testimonial (for edit form)
router.get(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  requireOwner,
  TestimonialController.getOne,
);

// Owner (cookie or token) OR Admin: update testimonial
router.patch(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  upload.single("image"),
  requireOwner,
  TestimonialController.update,
);

// Owner (cookie or token) OR Admin: delete testimonial
router.delete(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  requireOwner,
  TestimonialController.delete,
);

module.exports = router;
