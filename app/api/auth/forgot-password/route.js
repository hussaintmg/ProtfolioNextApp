import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "@/models/User";

const FP_SECRET = process.env.FP_SECRET;

export async function POST(req) {
  try {
    await connectDB();

    const { username, stateAsU } = await req.json();

    if (!username) {
      return NextResponse.json({ message: "Username or email is required" }, { status: 400 });
    }

    const searchField = stateAsU ? { username } : { email: username };
    const user = await User.findOne(searchField);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, FP_SECRET, { expiresIn: "10m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${code}\n\nThis code will expire in 10 minutes.`,
      });
    } catch (err) {
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      await user.save();
      return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }

    const res = NextResponse.json({ message: "Verification code sent to your email" });
    res.cookies.set("fp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 600,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
