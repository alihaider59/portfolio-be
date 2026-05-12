const Experience = require("./experienceModel");

class ExperienceService {
  async getPublicAll() {
    return Experience.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
  }

  async getAllAdmin() {
    return Experience.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  async getById(id) {
    return Experience.findById(id).lean();
  }

  async create(data) {
    return Experience.create(data);
  }

  async updateById(id, data) {
    return Experience.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(id) {
    return Experience.findByIdAndDelete(id).lean();
  }
}

module.exports = new ExperienceService();
