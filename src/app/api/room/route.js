import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";
import User from "@/app/utils/models/User";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to stream upload to Cloudinary
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "roommates_uploads" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export async function POST(request) {
  await DBconnection();

  try {
    const data = await request.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const total = data.get("total");
    const perHead = data.get("perHead");
    const area = data.get("area");
    const city = data.get("city");
    const description = data.get("description");
    const image = data.get("image");

    let imageUrl = "";
    if (image && typeof image.name === "string") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await streamUpload(buffer);
      imageUrl = uploadResult.secure_url;
    }

    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables.");
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.room.length >= 2) {
      return NextResponse.json(
        { message: "User can only add up to 2 rooms" },
        { status: 400 },
      );
    }

    const roomData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(total && { total }),
      ...(perHead && { perHead }),
      ...(area && { area }),
      ...(city && { city }),
      ...(description && { description }),
      ...(imageUrl && { image: imageUrl }),
      user: user._id,
    };

    const room = new Room(roomData);
    const savedRoom = await room.save();

    user.room.push(savedRoom._id);
    await user.save();

    return NextResponse.json(
      {
        message: "Room added successfully",
        roomId: savedRoom._id,
        userRoomName: savedRoom.name,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}
