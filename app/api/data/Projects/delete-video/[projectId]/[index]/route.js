import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

export async function DELETE(req, context) {
  await connectDB();

  try {
    const { projectId, index } = await context.params; // ✅ await params properly
    const videoIndex = parseInt(index);

    if (!projectId || isNaN(videoIndex)) {
      return NextResponse.json(
        { success: false, message: "Project ID and valid index are required" },
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

    const projectIndex = projectsDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Project not found in array" },
        { status: 404 }
      );
    }

    const videosArr = projectsDoc.projectsArr[projectIndex].videos;

    if (videoIndex < 0 || videoIndex >= videosArr.length) {
      return NextResponse.json(
        { success: false, message: "Invalid video index" },
        { status: 400 }
      );
    }

    const videoObj = videosArr[videoIndex];

    // Delete from Cloudinary if public_id exists
    if (videoObj?.public_id) {
      await cloudinary.uploader.destroy(videoObj.public_id, {
        resource_type: "video",
      });
    }

    // Remove video from array
    videosArr.splice(videoIndex, 1);
    await projectsDoc.save();

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully from Cloudinary and database",
    });
  } catch (err) {
    console.error("Delete Video Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
