const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin/adminRoutes");
const contactRoutes = require("./contact/contactRoutes");
const paymentRoutes = require("./payment/paymentRoutes");
const visitorRoutes = require("./visitor/visitorRoutes");
const testimonialRoutes = require("./testimonial/testimonialRoutes");

router.use("/admin", adminRoutes);
router.use("/visitor", visitorRoutes);
router.use("/contact", contactRoutes);
router.use("/payment", paymentRoutes);
router.use("/testimonials", testimonialRoutes);

module.exports = router;