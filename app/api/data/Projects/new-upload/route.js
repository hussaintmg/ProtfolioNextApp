import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const link = formData.get("link");

    if (!title) return NextResponse.json({ message: "Title is required" }, { status: 400 });
    if (!link) return NextResponse.json({ message: "Link is required" }, { status: 400 });

    const imgDir = path.join(process.cwd(), "public", "uploads", "images");
    const vidDir = path.join(process.cwd(), "public", "uploads", "videos");
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
    if (!fs.existsSync(vidDir)) fs.mkdirSync(vidDir, { recursive: true });

    const images = [];
    const videos = [];

    for (const [key, value] of formData.entries()) {
      if (key === "images[]" && value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const filePath = path.join(imgDir, value.name);
        fs.writeFileSync(filePath, buffer);
        images.push(`/uploads/images/${value.name}`);
      }
      if (key === "videos[]" && value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const filePath = path.join(vidDir, value.name);
        fs.writeFileSync(filePath, buffer);
        videos.push(`/uploads/videos/${value.name}`);
      }
    }

    const existing = await Projects.findOne();
    const newProject = { title, link, images, videos };

    if (existing) {
      existing.projectsArr.push(newProject);
      await existing.save();
      return NextResponse.json({ message: "Project added successfully", project: newProject }, { status: 201 });
    } else {
      const created = new Projects({ projectsArr: [newProject] });
      await created.save();
      return NextResponse.json({ message: "Project uploaded successfully", project: newProject }, { status: 201 });
    }
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
