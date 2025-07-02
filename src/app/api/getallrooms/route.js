import { NextResponse } from "next/server";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";

export async function GET() {
  try {
    // Connect to MongoDB
    await DBconnection();

    // Fetch all rooms
    const rooms = await Room.find().sort({ date: -1 });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
