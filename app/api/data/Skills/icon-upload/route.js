import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  await connectDB();
  try {
    const formData = await req.formData();
    const file = formData.get("icon");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    // convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // create unique file name
    const uniqueName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);
    const iconPath = `/uploads/images/${uniqueName}`;
    let skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      skillsDoc = await Skills.create({ skIcons: [iconPath] });
    } else {
      skillsDoc.skIcons.push(iconPath);
      await skillsDoc.save();
    }
    return NextResponse.json({
      message: "Icon uploaded successfully",
      skills: skillsDoc,
    });
  } catch (err) {
    console.error("Icon upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
