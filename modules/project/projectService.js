const Project = require("./projectModel");

class ProjectService {
  async getPublicAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = { isActive: true };
    const projects = await Project.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Project.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;
    return { projects, total, totalPages };
  }

  async getAllAdmin() {
    return Project.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  async getById(id) {
    return Project.findById(id).lean();
  }

  async create(data) {
    return Project.create(data);
  }

  async updateById(id, data) {
    return Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(id) {
    return Project.findByIdAndDelete(id).lean();
  }
}

module.exports = new ProjectService();
