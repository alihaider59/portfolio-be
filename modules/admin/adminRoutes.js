const express = require("express");
const router = express.Router();
const AdminController = require("./adminController");
const DashboardController = require("../dashboard/dashboardController");
const { requireAdmin } = require("../../middleware/requireAdmin");

router.post("/login", AdminController.login);

router.get("/me", requireAdmin, (req, res) => {
  res.status(200).json({
    status: "success",
    data: { authenticated: true },
  });
});

router.get("/dashboard", requireAdmin, DashboardController.getOverview);
router.get("/dashboard/stats", requireAdmin, DashboardController.getStats);

router.get("/testimonials/:id", requireAdmin, AdminController.getTestimonialById);

module.exports = router;
