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

router.get("/", TestimonialController.getAll);
router.post("/", upload.single("image"), TestimonialController.create);

router.get("/edit/:token", TestimonialController.getByToken);
router.patch(
  "/edit/:token",
  upload.single("image"),
  TestimonialController.updateByToken,
);
router.delete("/edit/:token", TestimonialController.deleteByToken);

router.get(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  requireOwner,
  TestimonialController.getOne,
);

router.patch(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  upload.single("image"),
  requireOwner,
  TestimonialController.update,
);

router.delete(
  "/:id",
  setAdminIfValid,
  loadTestimonial(TestimonialService),
  requireOwner,
  TestimonialController.delete,
);

module.exports = router;
