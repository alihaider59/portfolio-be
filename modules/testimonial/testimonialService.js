const Testimonial = require("./testimonialModel");

class TestimonialService {
  async create(data) {
    const testimonial = await Testimonial.create(data);
    return testimonial;
  }

  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Testimonial.countDocuments();
    const totalPages = Math.ceil(total / limit) || 1;
    return { testimonials, total, totalPages };
  }
}

module.exports = new TestimonialService();
