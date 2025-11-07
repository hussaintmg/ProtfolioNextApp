import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  await connectDB();

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Find the parent document that contains the nested project
    const parentDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(id),
    });

    if (!parentDoc) {
      return NextResponse.json(
        { success: false, message: "Parent project document not found" },
        { status: 404 }
      );
    }

    // Find the project index in projectsArr
    const projectIndex = parentDoc.projectsArr.findIndex(
      (p) => p._id.toString() === id
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Project not found in array" },
        { status: 404 }
      );
    }

    // Get the project to be deleted
    const projectToDelete = parentDoc.projectsArr[projectIndex];

    // Delete all images
    if (projectToDelete.images && projectToDelete.images.length > 0) {
      projectToDelete.images.forEach((imgPath) => {
        const fullPath = path.join(process.cwd(), "public", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // Delete all videos
    if (projectToDelete.videos && projectToDelete.videos.length > 0) {
      projectToDelete.videos.forEach((vidPath) => {
        const fullPath = path.join(process.cwd(), "public", vidPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    // Remove the project from the array
    parentDoc.projectsArr.splice(projectIndex, 1);
    await parentDoc.save();

    return NextResponse.json({
      success: true,
      message: "Project and related files deleted successfully",
    });
  } catch (err) {
    console.error("Delete Project Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
