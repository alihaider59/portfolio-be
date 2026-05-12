const express = require("express");
const router = express.Router();

const adminRoutes = require("./admin/adminRoutes");
const contactRoutes = require("./contact/contactRoutes");
const paymentRoutes = require("./payment/paymentRoutes");
const visitorRoutes = require("./visitor/visitorRoutes");
const testimonialRoutes = require("./testimonial/testimonialRoutes");
const experienceRoutes = require("./experience/experienceRoutes");
const skillRoutes = require("./skill/skillRoutes");
const projectRoutes = require("./project/projectRoutes");

router.use("/admin", adminRoutes);
router.use("/visitor", visitorRoutes);
router.use("/contact", contactRoutes);
router.use("/payment", paymentRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/experiences", experienceRoutes);
router.use("/skills", skillRoutes);
router.use("/projects", projectRoutes);

module.exports = router;