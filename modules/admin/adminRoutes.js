const express = require("express");
const router = express.Router();
const AdminController = require("./adminController");
const { requireAdmin } = require("../../middleware/requireAdmin");

router.post("/login", AdminController.login);

router.get("/me", requireAdmin, (req, res) => {
  res.status(200).json({
    status: "success",
    data: { authenticated: true },
  });
});

module.exports = router;
