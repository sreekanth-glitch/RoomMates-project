// src/app/api/resend/route.js
import User from "@/app/utils/models/User";
import DBconnection from "@/app/utils/config/db";
import nodemailer from "nodemailer";

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
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
    subject: "Roommates - New OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #1c4475; color: #ff6600;">
        <h2 style="color: #ff6600;">Roommates - New OTP</h2>
        <p style="color: white;">Your new OTP is:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 10px 0;">${otp}</div>
        <p style="color: white;">This OTP is valid for 3 minutes.</p>
        <hr style="margin-top: 20px;">
        <small style="color: white;">If you didn't request this, you can safely ignore it.</small>
      </div>
    `,
  });
}

export async function POST(request) {
  await DBconnection();

  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check OTP cooldown (3 minutes)
    const now = Date.now();
    const expiresAt = user.otpExpiresAt
      ? new Date(user.otpExpiresAt).getTime()
      : 0;

    const diffSeconds = Math.ceil((expiresAt - now) / 1000);

    if (diffSeconds > 0) {
      return new Response(
        JSON.stringify({
          message: `You can request a new OTP after ${diffSeconds} seconds`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate new OTP
    const newOTP = generateOTP();
    user.otp = newOTP;
    user.otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
    await user.save();

    // Send the new OTP
    await sendOTPEmail(email, newOTP);

    return new Response(JSON.stringify({ message: "New OTP sent to email" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
