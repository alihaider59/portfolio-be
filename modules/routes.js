const express = require("express");
const router = express.Router();

const contactRoutes = require("./contact/contactRoutes");
const visitorRoutes = require("./visitor/visitorRoutes");

router.use("/visitor", visitorRoutes);
router.use("/contact", contactRoutes);

module.exports = router;