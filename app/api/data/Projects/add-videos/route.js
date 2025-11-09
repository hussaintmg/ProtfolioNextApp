import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import mongoose from "mongoose";
import { uploadFile } from "@/lib/cloudinary";

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

    // Find the project document
    const projectsDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!projectsDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const uploadedVideos = [];

    for (const file of files) {
      if (file instanceof File && file.size > 0) {

        // Upload to Cloudinary as video
        const result = await uploadFile(
          file.stream(),
          "projects/videos",
          null,
          "video" // specify resource type
        );

        // Push object matching schema
        uploadedVideos.push({
          video: result.url,
          public_id: result.publicId, // must match your schema
        });
      }
    }

    if (uploadedVideos.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid video files uploaded" },
        { status: 400 }
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

    // Push new videos into the project
    projectsDoc.projectsArr[projectIndex].videos.push(...uploadedVideos);
    await projectsDoc.save();

    return NextResponse.json({
      success: true,
      message: "Videos uploaded to Cloudinary successfully",
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
