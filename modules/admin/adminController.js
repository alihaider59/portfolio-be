const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const TestimonialService = require("../testimonial/testimonialService");

async function login(req, res) {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!adminEmail || adminPassword === undefined || !secret) {
    return res.status(503).json({
      status: "fail",
      message: "Admin login is not configured.",
    });
  }

  const emailMatch = email && String(email).trim().toLowerCase() === adminEmail.toLowerCase();
  const passwordMatch = password !== undefined && String(password) === String(adminPassword);

  if (!emailMatch || !passwordMatch) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    { sub: adminEmail, role: "admin" },
    secret,
    { expiresIn: process.env.ADMIN_JWT_EXPIRES || "7d" },
  );

  res.status(200).json({
    status: "success",
    message: "Logged in successfully.",
    data: {
      token,
      user: {
        email: adminEmail,
      },
    },
  });
}

function toResponseItem(doc) {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
  delete obj.email;
  delete obj.token;
  if (obj.image && !obj.image.startsWith("http")) {
    obj.image = "/uploads/" + obj.image;
  }
  return obj;
}

module.exports = {
  login: catchAsync(login)
};

