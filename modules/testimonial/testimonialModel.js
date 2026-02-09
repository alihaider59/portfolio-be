const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    testimonial: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    company: { type: String, required: true },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
