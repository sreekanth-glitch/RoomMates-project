import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    total: { type: Number },
    perHead: { type: Number },
    area: { type: String },
    city: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: false, // ✅ prevent createdAt and updatedAt
  }
);

// ✅ Ensure re-compilation without caching
mongoose.models.Room && delete mongoose.models.Room;

export default mongoose.model("Room", roomSchema);
