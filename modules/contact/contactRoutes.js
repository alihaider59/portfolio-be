const express = require("express");
const router = express.Router();
const ContactController = require("./contactController");
const { requireAdmin } = require("../../middleware/requireAdmin");

// Public: submit contact form
router.post("/", ContactController.saveContact);

// Admin only: list, get one, delete one or many
router.get("/all", requireAdmin, ContactController.getAllContacts);
router.get("/:id", requireAdmin, ContactController.getContactById);
router.delete("/", requireAdmin, ContactController.deleteContacts);

module.exports = router;
