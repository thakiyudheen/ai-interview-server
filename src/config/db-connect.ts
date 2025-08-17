import mongoose from "mongoose";

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/bg-remover";

export const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
