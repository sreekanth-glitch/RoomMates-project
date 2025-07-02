import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";

const secretKey = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await DBconnection();

    // 1. Get token from headers
    const token = req.headers.get("token");

    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 400 }
      );
    }

    // 2. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 3. Find rooms by userId
    const rooms = await Room.find({ user: decoded.userId });

    if (!rooms || rooms.length === 0) {
      return NextResponse.json(
        { message: "No room assigned" },
        { status: 404 }
      );
    }

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Get room details error:", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
