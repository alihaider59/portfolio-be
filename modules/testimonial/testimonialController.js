const catchAsync = require("../../utils/catchAsync");
const TestimonialService = require("./testimonialService");
const { uploadImage } = require("../../utils/cloudinary");

function toResponseItem(doc) {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
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
    const { testimonial, name, designation, company } = req.body;
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
    });

    res.status(201).json({
      status: "success",
      message: "Thank you for your feedback!",
      data: toResponseItem(created),
    });
  });
}

module.exports = new TestimonialController();
