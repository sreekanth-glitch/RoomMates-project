// src/app/api/verify/route.js
import User from "@/app/utils/models/User";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!user.otp || user.otp !== otp || Date.now() > user.otpExpiresAt) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired OTP" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await User.updateOne({ email }, { $unset: { otp: "", otpExpiresAt: "" } });

    return new Response(
      JSON.stringify({
        message: "OTP verified successfully, you can now log in",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
