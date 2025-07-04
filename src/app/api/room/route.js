import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";
import User from "@/app/utils/models/User";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    await DBconnection();

    const data = await request.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const total = data.get("total");
    const perHead = data.get("perHead");
    const area = data.get("area");
    const city = data.get("city");
    const description = data.get("description");
    const image = data.get("image");

    const token = request.headers.get("token");
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
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
        { message: "Max 2 rooms allowed" },
        { status: 400 },
      );
    }

    // Upload image to Cloudinary
    let imageUrl = "";
    if (image && image.name) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "roommates_uploads" }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploaded.secure_url;
    }

    const room = new Room({
      name,
      phone,
      total,
      perHead,
      area,
      city,
      description,
      image: imageUrl,
      user: user._id,
    });

    const savedRoom = await room.save();
    user.room.push(savedRoom._id);
    await user.save();

    return NextResponse.json(
      { message: "Room added successfully", roomId: savedRoom._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
