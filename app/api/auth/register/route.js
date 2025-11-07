import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    let { username, email, password, remember } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { message: "Email already exists" },
        { status: 409 }
      );
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Username already exists",
          message: "Username already exists",
        },
        { status: 409 }
      );
    }
    let role = "user";
    if (password.slice(0, 6) === process.env.ADMIN_CODE) {
      role = "admin";
      password = password.slice(6);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: remember ? "7d" : "1h" }
    );

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
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
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
