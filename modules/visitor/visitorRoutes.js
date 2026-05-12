const express = require("express");
const router = express.Router();
const VisitorController = require("./visitorController");
const { requireAdmin } = require("../../middleware/requireAdmin");

// Public: track visitor
router.get("/track", VisitorController.trackVisitor);

// Admin only: list all visitors, get visitor by id
router.get("/all", requireAdmin, VisitorController.getAllVisitors);
router.get("/:id", requireAdmin, VisitorController.getVisitorById);

module.exports = router;
