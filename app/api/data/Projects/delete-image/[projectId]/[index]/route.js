import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const { projectId, index } = params;
    const imgIndex = parseInt(index);

    if (isNaN(imgIndex)) {
      return NextResponse.json({ message: "Invalid index" }, { status: 400 });
    }

    const projectsDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!projectsDoc) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const projectIndex = projectsDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { message: "Project not found in array" },
        { status: 404 }
      );
    }

    const project = projectsDoc.projectsArr[projectIndex];

    if (imgIndex < 0 || imgIndex >= project.images.length) {
      return NextResponse.json({ message: "Invalid index" }, { status: 400 });
    }

    const imagePath = project.images[imgIndex];
    const absolutePath = path.join(
      process.cwd(),
      "public",
      imagePath.replace("/uploads/", "uploads/")
    );

    project.images.splice(imgIndex, 1);
    await projectsDoc.save();

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    return NextResponse.json({
      message: "Image deleted successfully",
      project,
    });
  } catch (err) {
    console.error("Delete Image Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
    