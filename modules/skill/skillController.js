const catchAsync = require("../../utils/catchAsync");
const SkillService = require("./skillService");
const { uploadImage } = require("../../utils/cloudinary");

function toBool(value) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
}

function toResponse(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  obj.id = String(obj._id);
  delete obj._id;
  delete obj.__v;
  return obj;
}

class SkillController {
  getAll = catchAsync(async (req, res) => {
    const skills = await SkillService.getPublicAll();
    res.status(200).json({
      status: "success",
      results: skills.length,
      data: skills.map(toResponse),
    });
  });

  getAllAdmin = catchAsync(async (req, res) => {
    const skills = await SkillService.getAllAdmin();
    res.status(200).json({
      status: "success",
      results: skills.length,
      data: skills.map(toResponse),
    });
  });

  getOne = catchAsync(async (req, res) => {
    const skill = await SkillService.getById(req.params.id);
    if (!skill || skill.isActive === false) {
      return res.status(404).json({ status: "fail", message: "Skill not found." });
    }

    res.status(200).json({
      status: "success",
      data: toResponse(skill),
    });
  });

  create = catchAsync(async (req, res) => {
    const { name, sortOrder, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "fail",
        message: "name is required.",
      });
    }

    const created = await SkillService.create({
      name: String(name).trim(),
      sortOrder: sortOrder != null ? Number(sortOrder) : undefined,
      isActive: toBool(isActive),
    });

    res.status(201).json({
      status: "success",
      message: "Skill created.",
      data: toResponse(created),
    });
  });

  update = catchAsync(async (req, res) => {
    const updateData = {};
    const { name, sortOrder, isActive } = req.body;

    if (name !== undefined) updateData.name = String(name).trim();
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
    if (isActive !== undefined) updateData.isActive = toBool(isActive);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided to update.",
      });
    }

    const updated = await SkillService.updateById(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ status: "fail", message: "Skill not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Skill updated.",
      data: toResponse(updated),
    });
  });

  updateIcon = catchAsync(async (req, res) => {
    if (!req.file?.buffer) {
      return res.status(400).json({ status: "fail", message: "icon file is required." });
    }

    const uploadedIcon = await uploadImage(req.file.buffer, { folder: "portfolio/skills" });
    const updated = await SkillService.updateById(req.params.id, {
      icon: uploadedIcon.secure_url,
    });
    if (!updated) {
      return res.status(404).json({ status: "fail", message: "Skill not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Skill icon updated.",
      data: toResponse(updated),
    });
  });

  delete = catchAsync(async (req, res) => {
    const deleted = await SkillService.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: "fail", message: "Skill not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Skill deleted.",
    });
  });
}

module.exports = new SkillController();
