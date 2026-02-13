const catchAsync = require("../../utils/catchAsync");
const DashboardService = require("./dashboardService");

class DashboardController {
  getOverview = catchAsync(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 5;
    const data = await DashboardService.getOverview(limit);

    res.status(200).json({
      status: "success",
      data,
    });
  });

  getStats = catchAsync(async (req, res) => {
    const stats = await DashboardService.getStats();

    res.status(200).json({
      status: "success",
      data: stats,
    });
  });
}

module.exports = new DashboardController();
