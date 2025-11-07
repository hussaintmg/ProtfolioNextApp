import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const projectId = formData.get("projectId");
    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    const files = formData.getAll("videos");
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No videos provided" },
        { status: 400 }
      );
    }

    const projectsDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });
    if (!projectsDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const vidDir = path.join(process.cwd(), "public", "uploads", "videos");
    if (!fs.existsSync(vidDir)) fs.mkdirSync(vidDir, { recursive: true });

    const uploadedVideos = [];
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueName = `${Date.now()}-${file.name}`;
        const filePath = path.join(vidDir, uniqueName);
        fs.writeFileSync(filePath, buffer);
        uploadedVideos.push(`/uploads/videos/${uniqueName}`);
      }
    }

    const projectIndex = projectsDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );
    projectsDoc.projectsArr[projectIndex].videos.push(...uploadedVideos);
    await projectsDoc.save();

    return NextResponse.json({
      success: true,
      message: "Videos added successfully",
      videos: uploadedVideos,
    });
  } catch (err) {
    console.error("Add Videos Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
