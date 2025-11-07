import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import fs from "fs";
import path from "path";

export async function PUT(req, { params }) {
  await connectDB();
  const { index } = params;

  try {
    const formData = await req.formData();
    const file = formData.get("icon");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const skills = await Skills.findOne();
    if (!skills) {
      return NextResponse.json({ error: "No Skills document found" }, { status: 404 });
    }

    const currentIconPath = skills.skIcons[index];
    if (!currentIconPath) {
      return NextResponse.json({ error: "Invalid icon index" }, { status: 400 });
    }

    const oldPath = path.join(process.cwd(), "public", currentIconPath);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const newFileName = Date.now() + "-" + file.name;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newPath = path.join(uploadDir, newFileName);
    fs.writeFileSync(newPath, buffer);

    const relativePath = `/uploads/images/${newFileName}`;

    skills.skIcons[index] = relativePath;
    await skills.save();

    return NextResponse.json({
      message: "Icon updated successfully",
      newPath: relativePath,
      skills,
    });
  } catch (error) {
    console.error("Error updating icon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}