import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const { newPassword } = await req.json();
    // use the same cookie name you set in check-code route
    const token = req.cookies.get("resetToken")?.value;

    if (!token)
      return NextResponse.json(
        { message: "Reset token missing" },
        { status: 401 }
      );

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 401 }
      );
    }

    const user = await User.findOne({
      _id: decoded.userId,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 401 }
      );

    // hash password
    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    const res = NextResponse.json({ message: "Password reset successfully" });

    // delete resetToken cookie
    res.cookies.set("resetToken", "", { maxAge: 0, path: "/" });

    return res;
  } catch (err) {
    console.error("reset-password error:", err);
    return NextResponse.json(
      { message: "Server error resetting password" },
      { status: 500 }
    );
  }
}
