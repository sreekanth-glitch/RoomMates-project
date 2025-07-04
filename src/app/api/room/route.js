import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";
import User from "@/app/utils/models/User";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

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

    // Save image to public/uploads
    let imageUrl = "";
    if (image && image.name) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, image.name);
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${image.name}`; // relative path for frontend access
    }

    const roomData = {
      name,
      phone,
      total,
      perHead,
      area,
      city,
      description,
      image: imageUrl,
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
