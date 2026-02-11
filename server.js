require("dotenv").config();
const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/dbConfig");
const routes = require("./modules/routes");

connectDB();
const app = express();

app.set("trust proxy", 1);

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    if (req.ip === "::1") {
      req.ip = "127.0.0.1";
    }
    next();
  });
}

app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-secret", "x-edit-token"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  const ip = (req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim() || req.ip || req.connection.remoteAddress;
  req.clientIp = ip;
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(hpp());

// Static files for uploaded testimonial images (e.g. /uploads/testimonials/xxx.jpg)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use("/api", limiter);
app.use("/api", routes);

app.use("/api/welcome", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the to Server",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
