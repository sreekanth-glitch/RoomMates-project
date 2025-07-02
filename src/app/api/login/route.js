// src/app/api/login/route.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/utils/models/User";
import DBconnection from "@/app/utils/config/db";

const secretKey = process.env.JWT_SECRET; // make sure this is set in your .env

export async function POST(request) {
  try {
    await DBconnection();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (user.otp || user.otpExpiresAt) {
      return new Response(
        JSON.stringify({
          error: "Account not verified. Please verify your OTP.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    return new Response(
      JSON.stringify({ success: "Login successful", token, userId: user._id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
