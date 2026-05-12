const express = require("express");
const router = express.Router();
const ProjectController = require("./projectController");
const upload = require("../testimonial/uploadMiddleware");
const { requireAdmin } = require("../../middleware/requireAdmin");

router.get("/", ProjectController.getAll);
router.get("/all", requireAdmin, ProjectController.getAllAdmin);
router.post("/", requireAdmin, ProjectController.create);
router.patch("/:id/image", requireAdmin, upload.single("image"), ProjectController.updateImage);
router.patch("/:id", requireAdmin, ProjectController.update);
router.get("/:id", requireAdmin, ProjectController.getOne);
router.delete("/:id", requireAdmin, ProjectController.delete);

module.exports = router;
