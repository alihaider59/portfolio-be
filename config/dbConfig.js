const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const { DB_USER, DB_PASS, DB_NAME, DB_CLUSTER } = process.env;
  
    const URI = `mongodb+srv://${DB_USER}:${encodeURIComponent(
      DB_PASS,
    )}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`;

    await mongoose.connect(URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
