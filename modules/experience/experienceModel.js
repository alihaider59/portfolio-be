const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    icon: { type: String, default: null, trim: true },
    iconBg: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    points: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one point is required.",
      },
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Experience", experienceSchema);
