const catchAsync = require("../../utils/catchAsync");
const ExperienceService = require("./experienceService");
const { uploadImage } = require("../../utils/cloudinary");

function toResponse(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  obj.id = String(obj._id);
  delete obj._id;
  delete obj.__v;
  return obj;
}

function toBool(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
}

function normalizePoints(points) {
  if (!Array.isArray(points)) return null;
  const cleaned = points.map((point) => String(point).trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : null;
}

class ExperienceController {
  getAll = catchAsync(async (req, res) => {
    const experiences = await ExperienceService.getPublicAll();
    res.status(200).json({
      status: "success",
      results: experiences.length,
      data: experiences.map(toResponse),
    });
  });

  getAllAdmin = catchAsync(async (req, res) => {
    const experiences = await ExperienceService.getAllAdmin();
    res.status(200).json({
      status: "success",
      results: experiences.length,
      data: experiences.map(toResponse),
    });
  });

  getOne = catchAsync(async (req, res) => {
    const experience = await ExperienceService.getById(req.params.id);
    if (!experience || experience.isActive === false) {
      return res.status(404).json({ status: "fail", message: "Experience not found." });
    }

    res.status(200).json({
      status: "success",
      data: toResponse(experience),
    });
  });

  create = catchAsync(async (req, res) => {
    const { title, companyName, iconBg, date, points, sortOrder, isActive } = req.body;
    const normalizedPoints = normalizePoints(points);

    if (!title || !companyName || !iconBg || !date || !normalizedPoints) {
      return res.status(400).json({
        status: "fail",
        message: "title, companyName, iconBg, date, and at least one point are required.",
      });
    }

    const created = await ExperienceService.create({
      title: String(title).trim(),
      companyName: String(companyName).trim(),
      iconBg: String(iconBg).trim(),
      date: String(date).trim(),
      points: normalizedPoints,
      sortOrder: sortOrder != null ? Number(sortOrder) : undefined,
      isActive: toBool(isActive),
    });

    res.status(201).json({
      status: "success",
      message: "Experience created.",
      data: toResponse(created),
    });
  });

  update = catchAsync(async (req, res) => {
    const updateData = {};
    const { title, companyName, iconBg, date, points, sortOrder, isActive } = req.body;

    if (title !== undefined) updateData.title = String(title).trim();
    if (companyName !== undefined) updateData.companyName = String(companyName).trim();
    if (iconBg !== undefined) updateData.iconBg = String(iconBg).trim();
    if (date !== undefined) updateData.date = String(date).trim();
    if (points !== undefined) {
      const normalizedPoints = normalizePoints(points);
      if (!normalizedPoints) {
        return res.status(400).json({
          status: "fail",
          message: "points must include at least one item.",
        });
      }
      updateData.points = normalizedPoints;
    }
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
    if (isActive !== undefined) updateData.isActive = toBool(isActive);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided to update.",
      });
    }

    const updated = await ExperienceService.updateById(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ status: "fail", message: "Experience not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Experience updated.",
      data: toResponse(updated),
    });
  });

  updateIcon = catchAsync(async (req, res) => {
    if (!req.file?.buffer) {
      return res.status(400).json({ status: "fail", message: "icon file is required." });
    }

    const uploadedIcon = await uploadImage(req.file.buffer, { folder: "portfolio/experiences" });
    const updated = await ExperienceService.updateById(req.params.id, {
      icon: uploadedIcon.secure_url,
    });
    if (!updated) {
      return res.status(404).json({ status: "fail", message: "Experience not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Experience icon updated.",
      data: toResponse(updated),
    });
  });

  delete = catchAsync(async (req, res) => {
    const deleted = await ExperienceService.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: "fail", message: "Experience not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Experience deleted.",
    });
  });
}

module.exports = new ExperienceController();
