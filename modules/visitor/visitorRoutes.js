const express = require("express");
const router = express.Router();
const VisitorController = require("./visitorController");

router.get("/track", VisitorController.trackVisitor);

router.get("/all", VisitorController.getAllVisitors);
router.get("/:id", VisitorController.getVisitorById);

module.exports = router;
