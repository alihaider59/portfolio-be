const express = require("express");
const router = express.Router();
const ExperienceController = require("./experienceController");
const upload = require("../testimonial/uploadMiddleware");
const { requireAdmin } = require("../../middleware/requireAdmin");

router.get("/", ExperienceController.getAll);
router.get("/all", requireAdmin, ExperienceController.getAllAdmin);
router.post("/", requireAdmin, ExperienceController.create);
router.patch("/:id/icon", requireAdmin, upload.single("icon"), ExperienceController.updateIcon);
router.patch("/:id", requireAdmin, ExperienceController.update);
router.get("/:id", requireAdmin, ExperienceController.getOne);
router.delete("/:id", requireAdmin, ExperienceController.delete);

module.exports = router;
