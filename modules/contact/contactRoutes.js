const express = require("express");
const router = express.Router();
const ContactController = require("./contactController");

router.post("/", ContactController.saveContact);

router.get("/all", ContactController.getAllContacts);
router.get("/:id", ContactController.getContactById);

module.exports = router;
