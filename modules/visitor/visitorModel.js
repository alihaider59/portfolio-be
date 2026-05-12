const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ipAddress: { type: String, required: true, unique: true },
    visits: { type: Number, default: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Visitor", visitorSchema);
