const express = require("express");
const router = express.Router();
const VisitorController = require("./visitorController");


// Public API to track visitor
router.get("/track", VisitorController.trackVisitor);

// Admin API to view all visitors
router.get("/all", VisitorController.getAllVisitors);
router.get("/:id", VisitorController.getVisitorById);

module.exports = router;
