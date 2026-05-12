const catchAsync = require("../../utils/catchAsync");
const ProjectService = require("./projectService");
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

function normalizeButtons(buttons) {
  if (!Array.isArray(buttons)) return null;
  return buttons.map((button) => ({
    label: String(button.label || "").trim(),
    link: button.link != null ? String(button.link).trim() : "",
    disabled: Boolean(button.disabled),
  }));
}

class ProjectController {
  getAll = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const { projects, total, totalPages } = await ProjectService.getPublicAll(page, limit);

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: projects.map(toResponse),
      pagination: { page, limit, total, totalPages },
    });
  });

  getAllAdmin = catchAsync(async (req, res) => {
    const projects = await ProjectService.getAllAdmin();
    res.status(200).json({
      status: "success",
      results: projects.length,
      data: projects.map(toResponse),
    });
  });

  getOne = catchAsync(async (req, res) => {
    const project = await ProjectService.getById(req.params.id);
    if (!project || project.isActive === false) {
      return res.status(404).json({ status: "fail", message: "Project not found." });
    }

    res.status(200).json({
      status: "success",
      data: toResponse(project),
    });
  });

  create = catchAsync(async (req, res) => {
    const { name, description, isPrivate, buttons, sortOrder, isActive } = req.body;
    const normalizedButtons = normalizeButtons(buttons ?? []);

    if (!name || !description || isPrivate === undefined || !normalizedButtons) {
      return res.status(400).json({
        status: "fail",
        message: "name, description, isPrivate, and buttons are required.",
      });
    }

    if (normalizedButtons.some((button) => !button.label)) {
      return res.status(400).json({
        status: "fail",
        message: "Each button must include a label.",
      });
    }

    const created = await ProjectService.create({
      name: String(name).trim(),
      description: String(description).trim(),
      isPrivate: toBool(isPrivate),
      buttons: normalizedButtons,
      sortOrder: sortOrder != null ? Number(sortOrder) : undefined,
      isActive: toBool(isActive),
    });

    res.status(201).json({
      status: "success",
      message: "Project created.",
      data: toResponse(created),
    });
  });

  update = catchAsync(async (req, res) => {
    const updateData = {};
    const { name, description, isPrivate, buttons, sortOrder, isActive } = req.body;

    if (name !== undefined) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (isPrivate !== undefined) updateData.isPrivate = toBool(isPrivate);
    if (buttons !== undefined) {
      const normalizedButtons = normalizeButtons(buttons);
      if (!normalizedButtons) {
        return res.status(400).json({
          status: "fail",
          message: "buttons must be an array.",
        });
      }
      if (normalizedButtons.some((button) => !button.label)) {
        return res.status(400).json({
          status: "fail",
          message: "Each button must include a label.",
        });
      }
      updateData.buttons = normalizedButtons;
    }
    if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
    if (isActive !== undefined) updateData.isActive = toBool(isActive);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided to update.",
      });
    }

    const updated = await ProjectService.updateById(req.params.id, updateData);
    if (!updated) {
      return res.status(404).json({ status: "fail", message: "Project not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Project updated.",
      data: toResponse(updated),
    });
  });

  updateImage = catchAsync(async (req, res) => {
    if (!req.file?.buffer) {
      return res.status(400).json({ status: "fail", message: "image file is required." });
    }

    const uploadedImage = await uploadImage(req.file.buffer, { folder: "portfolio/projects" });
    const updated = await ProjectService.updateById(req.params.id, {
      image: uploadedImage.secure_url,
    });
    if (!updated) {
      return res.status(404).json({ status: "fail", message: "Project not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Project image updated.",
      data: toResponse(updated),
    });
  });

  delete = catchAsync(async (req, res) => {
    const deleted = await ProjectService.deleteById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: "fail", message: "Project not found." });
    }

    res.status(200).json({
      status: "success",
      message: "Project deleted.",
    });
  });
}

module.exports = new ProjectController();
