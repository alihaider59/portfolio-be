const express = require("express");
const router = express.Router();
const ContactController = require("./contactController");

// Public API to submit contact form
router.post("/", ContactController.saveContact);

// Admin API to view all contacts
router.get("/all", ContactController.getAllContacts);
router.get("/:id", ContactController.getContactById);

module.exports = router;
