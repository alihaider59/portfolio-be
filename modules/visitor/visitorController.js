const catchAsync = require("../../utils/catchAsync");
const VisitorService = require("./vistorService");

class VisitorController {
  trackVisitor = catchAsync(async (req, res) => {
    // Use IP extracted from middleware (before sanitization)
    const ip = req.clientIp;

    const totalVisitors = await VisitorService.trackVisitor(ip);

    res.status(200).json({
      status: "success",
      totalVisitors,
    });
  });

  getAllVisitors = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { visitors, total } = await VisitorService.getAllVisitors(parseInt(page), parseInt(limit));

    res.status(200).json({
      status: "success",
      results: visitors.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
      data: visitors,
    });
  });

  getVisitorById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const visitor = await VisitorService.getVisitorById(id);

    if (!visitor) {
      return res
        .status(404)
        .json({ status: "fail", message: "Visitor not found" });
    }

    res.status(200).json({
      status: "success",
      data: visitor,
    });
  });
}

module.exports = new VisitorController();
