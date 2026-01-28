require("dotenv").config();
const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("./utils/mongoSanitize");

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
app.use(express.json());
app.use(mongoSanitize);
app.use(hpp());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

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
