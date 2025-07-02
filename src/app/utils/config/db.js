import mongoose from "mongoose";

const DBconnection = async () => {
  const uri = process.env.MONGOOSE_URI;

  if (!uri) {
    console.error("❌ MONGOOSE_URI is not defined in environment variables.");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default DBconnection;
