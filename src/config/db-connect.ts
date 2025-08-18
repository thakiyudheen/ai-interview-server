import mongoose from "mongoose";

const MONGO_URL =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bg-remover";

let isConnected: boolean = false;

export const connectToDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URL, {
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
