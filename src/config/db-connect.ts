import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URI as string;

let isConnected: boolean = false;

export const connectToDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
