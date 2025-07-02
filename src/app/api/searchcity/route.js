import { NextResponse } from "next/server";
import DBconnection from "@/app/utils/config/db";
import Room from "@/app/utils/models/room";

export async function GET(req) {
  try {
    await DBconnection();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    let query = {};

    if (city) {
      query.city = { $regex: new RegExp(city, "i") }; // case-insensitive match
    }

    const rooms = await Room.find(query).sort({ date: -1 });

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
