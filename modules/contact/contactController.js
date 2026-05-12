const catchAsync = require("../../utils/catchAsync");
const ContactService = require("./contactService");
const EmailService = require("../email/emailService");

class ContactController {
  saveContact = catchAsync(async (req, res) => {
    const ip = (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim() || req.ip || req.connection.remoteAddress;
    const { name, email, message } = req.body;

    const contact = await ContactService.saveContact({
      name,
      email,
      message,
      ipAddress: ip,
    });

    try {
      await EmailService.sendContactThankYou(contact.email, contact.name);
      await EmailService.sendContactAlertToOwner({ name: contact.name, email: contact.email, message: contact.message });
    } catch (err) {
      console.error("Contact emails failed:", err.message);
    }

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: contact,
    });
  });

  getAllContacts = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { contacts, total } = await ContactService.getAllContacts(parseInt(page), parseInt(limit));
    res.status(200).json({
      status: "success",
      results: contacts.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
      data: contacts,
    });
  });

  getContactById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const contact = await ContactService.getContactById(id);

    if (!contact) {
      return res
        .status(404)
        .json({ status: "fail", message: "Contact not found" });
    }

    res.status(200).json({
      status: "success",
      data: contact,
    });
  });

  deleteContacts = catchAsync(async (req, res) => {
    const body = req.body || {};
    const queryIds = req.query.ids ? String(req.query.ids).split(",").map((s) => s.trim()).filter(Boolean) : [];
    const ids = Array.isArray(body.ids) ? body.ids : body.id != null ? [body.id] : queryIds;

    if (ids.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Provide one or more contact ids in body: { ids: [\"id1\", \"id2\"] } or { id: \"id1\" }, or query: ?ids=id1,id2",
      });
    }

    const { deletedCount } = await ContactService.deleteByIds(ids);

    res.status(200).json({
      status: "success",
      message: deletedCount === 1 ? "Contact deleted." : `${deletedCount} contacts deleted.`,
      deletedCount,
    });
  });
}

module.exports = new ContactController();
