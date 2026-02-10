const express = require("express");
const router = express.Router();

const contactRoutes = require("./contact/contactRoutes");
const visitorRoutes = require("./visitor/visitorRoutes");
const testimonialRoutes = require("./testimonial/testimonialRoutes");
const adminRoutes = require("./admin/adminRoutes");

router.use("/visitor", visitorRoutes);
router.use("/contact", contactRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/admin", adminRoutes);

module.exports = router;