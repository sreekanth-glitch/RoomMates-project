import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";
import User from "@/app/utils/models/User";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  await DBconnection();

  try {
    // Parse FormData
    const data = await request.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const total = data.get("total");
    const perHead = data.get("perHead");
    const area = data.get("area");
    const city = data.get("city");
    const description = data.get("description");
    const image = data.get("image");

    // Save file
    let imagePath = "";
    if (image && typeof image.name === "string") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      imagePath = `/uploads/${filename}`;
      const fullPath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(fullPath, buffer);
    }

    // Decode token from header
    const token = request.headers.get("token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
        { status: 400 }
      );
    }

    // ✅ Build room object only with provided fields
    const roomData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(total && { total }),
      ...(perHead && { perHead }),
      ...(area && { area }),
      ...(city && { city }),
      ...(description && { description }),
      ...(imagePath && { image: imagePath }),
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
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
