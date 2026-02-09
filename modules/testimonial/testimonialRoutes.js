const express = require("express");
const router = express.Router();
const TestimonialController = require("./testimonialController");
const upload = require("./uploadMiddleware");

router.get("/", TestimonialController.getAll);
router.post("/", upload.single("image"), TestimonialController.create);

module.exports = router;
