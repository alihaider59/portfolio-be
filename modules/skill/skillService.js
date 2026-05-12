const Skill = require("./skillModel");

class SkillService {
  async getPublicAll() {
    return Skill.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
  }

  async getAllAdmin() {
    return Skill.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  async getById(id) {
    return Skill.findById(id).lean();
  }

  async create(data) {
    return Skill.create(data);
  }

  async updateById(id, data) {
    return Skill.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(id) {
    return Skill.findByIdAndDelete(id).lean();
  }
}

module.exports = new SkillService();
