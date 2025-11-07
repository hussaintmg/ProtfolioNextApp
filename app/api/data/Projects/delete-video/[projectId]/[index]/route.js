import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  await connectDB();
  const { projectId, index } = params;

  try {
    const projectsDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });
    if (!projectsDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const projectIndex = projectsDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );
    const videosArr = projectsDoc.projectsArr[projectIndex].videos;

    if (index < 0 || index >= videosArr.length) {
      return NextResponse.json(
        { success: false, message: "Invalid index" },
        { status: 400 }
      );
    }

    const videoPath = path.join(
      process.cwd(),
      "public",
      videosArr[index].replace("/uploads/", "uploads/")
    );
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    videosArr.splice(index, 1);
    await projectsDoc.save();

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (err) {
    console.error("Delete Video Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
