const express = require("express");
const router = express.Router();
const SkillController = require("./skillController");
const upload = require("../testimonial/uploadMiddleware");
const { requireAdmin } = require("../../middleware/requireAdmin");

router.get("/", SkillController.getAll);
router.get("/all", requireAdmin, SkillController.getAllAdmin);
router.post("/", requireAdmin, SkillController.create);
router.patch("/:id/icon", requireAdmin, upload.single("icon"), SkillController.updateIcon);
router.patch("/:id", requireAdmin, SkillController.update);
router.get("/:id", requireAdmin, SkillController.getOne);
router.delete("/:id", requireAdmin, SkillController.delete);

module.exports = router;
