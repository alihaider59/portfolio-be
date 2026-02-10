const catchAsync = require("../../utils/catchAsync");
const TestimonialService = require("./testimonialService");
const { uploadImage } = require("../../utils/cloudinary");

function toResponseItem(doc) {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj.email;
  if (obj.image && !obj.image.startsWith("http")) {
    obj.image = "/uploads/" + obj.image;
  }
  return obj;
}

class TestimonialController {
  getAll = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const { testimonials, total, totalPages } = await TestimonialService.getAll(page, limit);
    const data = testimonials.map((t) => toResponseItem(t));

    res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  });

  create = catchAsync(async (req, res) => {
    const { testimonial, name, designation, company, email } = req.body;
    const ownerEmail = email ? String(email).trim().toLowerCase() : "";
    if (!ownerEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Email is required so you can update or delete your testimonial later.",
      });
    }
    let image = null;

    if (req.file && req.file.buffer) {
      const result = await uploadImage(req.file.buffer, { folder: "portfolio/testimonials" });
      image = result.secure_url;
    }

    const created = await TestimonialService.create({
      testimonial,
      name,
      designation,
      company,
      image,
      email: ownerEmail,
    });

    res.status(201).json({
      status: "success",
      message: "Thank you for your feedback! Use the same email to update or delete your testimonial later.",
      data: toResponseItem(created),
    });
  });

  update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body || {};
    const updateData = {};

    const testimonial = body.testimonial ?? body.message;
    const name = body.name;
    const designation = body.designation;
    const company = body.company;

    if (testimonial !== undefined && testimonial !== null && String(testimonial).trim() !== "")
      updateData.testimonial = String(testimonial).trim();
    if (name !== undefined && name !== null && String(name).trim() !== "")
      updateData.name = String(name).trim();
    if (designation !== undefined && designation !== null && String(designation).trim() !== "")
      updateData.designation = String(designation).trim();
    if (company !== undefined && company !== null && String(company).trim() !== "")
      updateData.company = String(company).trim();

    if (req.file && req.file.buffer) {
      const result = await uploadImage(req.file.buffer, { folder: "portfolio/testimonials" });
      updateData.image = result.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No changes made. Send testimonial, name, designation, company, or image to update.",
        data: toResponseItem(req.testimonial),
      });
    }

    const updated = await TestimonialService.updateById(id, updateData);
    if (!updated) {
      return res.status(404).json({ status: "fail", message: "Testimonial not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Testimonial updated.",
      data: toResponseItem(updated),
    });
  });

  delete = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await TestimonialService.deleteById(id);
    if (!deleted) {
      return res.status(404).json({ status: "fail", message: "Testimonial not found." });
    }
    res.status(200).json({
      status: "success",
      message: "Testimonial deleted.",
    });
  });
}

module.exports = new TestimonialController();
