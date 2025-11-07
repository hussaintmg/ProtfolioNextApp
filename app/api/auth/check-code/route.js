import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectDB();

    const { code } = await req.json();
    const token = req.cookies.get("fp_token")?.value;

    if (!token)
      return NextResponse.json(
        { message: "Token missing or expired" },
        { status: 401 }
      );

    const decoded = jwt.verify(token, process.env.FP_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (
      !user.resetCode ||
      user.resetCode !== code ||
      user.resetCodeExpires < Date.now()
    ) {
      return NextResponse.json(
        { message: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // generate reset-password token
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.RESET_SECRET,
      { expiresIn: "15m" }
    );

    // save rp token in MongoDB
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    const res = NextResponse.json({
      message: "Code verified successfully",
      username: user.username,
      email: user.email,
    });

    // delete fp_token cookie
    res.cookies.set("fp_token", "", { maxAge: 0, path: "/" });

    // set reset-password token cookie
    res.cookies.set("resetToken", resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("check-code error:", err);
    return NextResponse.json(
      { message: "Server error verifying code" },
      { status: 500 }
    );
  }
}
