import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();
  try {
    const formData = await req.formData();
    const file = formData.get("Prof");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const ProfilePath = `/uploads/images/${uniqueName}`;

    const oldData = await Home.findOne();

    // delete old profile file safely
    if (oldData?.Profile) {
      const oldPath = path.join(process.cwd(), "public", oldData.Profile);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const homeData = await Home.findOneAndUpdate(
      {},
      { Profile: ProfilePath },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Profile uploaded successfully",
      Profile: homeData.Profile,
    });
  } catch (err) {
    console.error("Profile upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
