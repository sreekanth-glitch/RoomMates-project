// src/app/api/register/route.js
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/app/utils/models/User";
import DBconnection from "@/app/utils/config/db";

export async function POST(request) {
  await DBconnection();
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 5 minutes

    const newUser = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: expiresAt,
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Roommates <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Roommates - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #1c4475; color: #ff6600;">
          <h2 style="color: #ff6600;">Welcome to Roommates!</h2>
          <p style="color: white;">Your OTP is:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 10px 0;">${otp}</div>
          <p style="color: white;">This OTP is valid for 5 minutes.</p>
          <hr style="margin-top: 20px;">
          <small style="color: white;">If you didn't request this, please ignore the email.</small>
        </div>
      `,
    });

    return new Response(JSON.stringify({ message: "OTP sent to email" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in register API:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
