const catchAsync = require("../../utils/catchAsync");
const ContactService = require("./contactService");

class ContactController {
  saveContact = catchAsync(async (req, res) => {
    // Extract real client IP from headers (for proxies/CDN)
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
}

module.exports = new ContactController();
