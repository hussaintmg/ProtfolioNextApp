import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const { username, password, remember } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return NextResponse.json(
        { error: "No User Found", message: "No User Found" },
        { status: 409 }
      );
    }

    const password_check = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!password_check)
      return NextResponse.json({ message: "Wrong Password" }, { status: 400 });

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: remember ? "7d" : "1h" }
    );

    const response = NextResponse.json(
      {
        message: "User Login successfully",
        user: {
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60,
      sameSite: "strict",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
