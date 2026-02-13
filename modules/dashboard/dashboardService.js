const Contact = require("../contact/contactModel");
const Visitor = require("../visitor/visitorModel");
const Testimonial = require("../testimonial/testimonialModel");

class DashboardService {
  async getOverview(limit = 5) {
    const safeLimit = Math.min(Math.max(1, parseInt(limit, 10) || 5), 20);

    const [stats, recentContacts, recentTestimonials, recentVisitors] = await Promise.all([
      this.getStats(),
      this.getRecentContacts(safeLimit),
      this.getRecentTestimonials(safeLimit),
      this.getRecentVisitors(safeLimit),
    ]);

    return {
      stats,
      recentContacts,
      recentTestimonials,
      recentVisitors,
    };
  }

  async getStats() {
    const [totalContacts, totalTestimonials, visitorStats] = await Promise.all([
      Contact.countDocuments(),
      Testimonial.countDocuments(),
      Visitor.aggregate([{ $group: { _id: null, totalVisitors: { $sum: 1 }, totalVisits: { $sum: "$visits" } } }]),
    ]);

    const visitorResult = visitorStats[0] || { totalVisitors: 0, totalVisits: 0 };

    return {
      totalContacts,
      totalTestimonials,
      totalVisitors: visitorResult.totalVisitors,
      totalVisits: visitorResult.totalVisits,
    };
  }

  async getRecentContacts(limit = 5) {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return contacts;
  }

  async getRecentTestimonials(limit = 5) {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-email -token")
      .lean();
    return testimonials.map((t) => {
      const obj = { ...t };
      if (obj.image && !obj.image.startsWith("http")) {
        obj.image = "/uploads/" + obj.image;
      }
      return obj;
    });
  }

  async getRecentVisitors(limit = 5) {
    const visitors = await Visitor.find()
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
    return visitors;
  }
}

module.exports = new DashboardService();
