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
    const index = formData.get("index");
    const video = formData.get("video");

    if (!projectId || index === undefined) {
      return NextResponse.json(
        { success: false, message: "Project ID and index are required" },
        { status: 400 }
      );
    }

    if (!(video instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No video file provided" },
        { status: 400 }
      );
    }

    const parentDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!parentDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found in projectsArr" },
        { status: 404 }
      );
    }

    const projectIndex = parentDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const vidDir = path.join(process.cwd(), "public", "uploads", "videos");
    if (!fs.existsSync(vidDir)) fs.mkdirSync(vidDir, { recursive: true });

    const oldVidPath = parentDoc.projectsArr[projectIndex].videos[index];
    if (oldVidPath) {
      const oldFullPath = path.join(process.cwd(), "public", oldVidPath);
      if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);
    }

    const buffer = Buffer.from(await video.arrayBuffer());
    const uniqueName = `${Date.now()}-${video.name}`;
    const newPath = path.join(vidDir, uniqueName);
    fs.writeFileSync(newPath, buffer);
    const publicPath = `/uploads/videos/${uniqueName}`;

    parentDoc.projectsArr[projectIndex].videos[index] = publicPath;
    await parentDoc.save();

    return NextResponse.json({
      success: true,
      message: "Video updated successfully",
      video: publicPath,
    });
  } catch (err) {
    console.error("Update video error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
