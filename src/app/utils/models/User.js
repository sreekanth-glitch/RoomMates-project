import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  otp: {
    type: String,
  },
  otpExpiresAt: { type: Date, expires: 0 },
  room: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room", // match the exact model name here!
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
