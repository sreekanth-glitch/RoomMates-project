import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";
import User from "@/app/utils/models/User";

const secretKey = process.env.JWT_SECRET;

export async function DELETE(req, { params }) {
  try {
    await DBconnection();

    const token = req.headers.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const roomId = params.roomId;

    // 1. Find and delete the room
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // 2. Pull roomId from all users in the room.user array
    if (deletedRoom.user) {
      await User.findByIdAndUpdate(deletedRoom.user, {
        $pull: { room: roomId },
      });
    }

    return NextResponse.json(
      { message: "Room deleted and removed from user(s)" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
