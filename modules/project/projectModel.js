const mongoose = require("mongoose");

const projectButtonSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    link: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
  { _id: false },
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: null, trim: true },
    isPrivate: { type: Boolean, required: true, default: false },
    buttons: { type: [projectButtonSchema], default: [] },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
