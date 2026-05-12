const Visitor = require("./visitorModel");

class VisitorService {
  async trackVisitor(ip) {
    let visitor = await Visitor.findOne({ ipAddress: ip });
    if (visitor) {
      visitor.visits += 1;
      await visitor.save();
    } else {
      visitor = await Visitor.create({ ipAddress: ip });
    }

    const totalVisitors = await Visitor.countDocuments();
    return totalVisitors;
  }

  async getAllVisitors(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const visitors = await Visitor.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Visitor.countDocuments();
    return { visitors, total };
  }

  async getVisitorById(id) {
    return await Visitor.findById(id);
  }
}

module.exports = new VisitorService();

