const Contact = require("./contactModel")

class ContactService {
  async saveContact(data) {
    const contact = await Contact.create(data);
    return contact;
  }

  async getAllContacts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const contacts = await Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Contact.countDocuments();
    return { contacts, total };
  }

  async getContactById(id) {
    return await Contact.findById(id);
  }

  async deleteByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return { deletedCount: 0 };
    const result = await Contact.deleteMany({ _id: { $in: ids } });
    return { deletedCount: result.deletedCount };
  }
}

module.exports = new ContactService();
