const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    testimonial: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    company: { type: String, required: true },
    image: { type: String, default: null },
    email: { type: String, default: null },
    token: { type: String, required: true }, // plain token for edit link lookup; never sent in API responses
  },
  { timestamps: true },
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
