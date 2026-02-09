const express = require("express");
const router = express.Router();

const contactRoutes = require("./contact/contactRoutes");
const visitorRoutes = require("./visitor/visitorRoutes");
const testimonialRoutes = require("./testimonial/testimonialRoutes");

router.use("/visitor", visitorRoutes);
router.use("/contact", contactRoutes);
router.use("/testimonials", testimonialRoutes);

module.exports = router;