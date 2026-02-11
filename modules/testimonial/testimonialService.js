const Testimonial = require("./testimonialModel");
const EmailService = require("../email/emailService"); // new import
const crypto = require("crypto");

class TestimonialService {
  async create(data) {
    const token = crypto.randomBytes(32).toString("hex");
    const testimonial = await Testimonial.create({ ...data, token });

    const editLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/testimonial/edit/${token}`;
    
    if (data.email) {
      await EmailService.sendTestimonialEditLink(data.email, data.name, editLink);
    }

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

  async getById(id) {
    return Testimonial.findById(id);
  }

  async getByToken(token) {
    return Testimonial.findOne({ token });
  }

  async updateById(id, data) {
    const updated = await Testimonial.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return updated;
  }

  async deleteById(id) {
    const deleted = await Testimonial.findByIdAndDelete(id);
    return deleted;
  }
}

module.exports = new TestimonialService();
