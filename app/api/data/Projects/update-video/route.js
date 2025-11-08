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
    const index = parseInt(formData.get("index"));
    const video = formData.get("video");

    if (!projectId || isNaN(index)) {
      return NextResponse.json(
        { success: false, message: "Project ID and index are required" },
        { status: 400 }
      );
    }

    if (!(video instanceof File) || video.size === 0) {
      return NextResponse.json(
        { success: false, message: "No valid video file provided" },
        { status: 400 }
      );
    }

    const parentDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!parentDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const projectIndex = parentDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Project not found in array" },
        { status: 404 }
      );
    }

    const project = parentDoc.projectsArr[projectIndex];
    const oldVideoObj = project.videos[index];

    // Upload the new video
    const buffer = Buffer.from(await video.arrayBuffer());
    const result = await uploadFile(
      buffer,
      "projects/videos",
      oldVideoObj?.public_id || null,
      "video"
    );

    // Update the video at the same index
    project.videos[index] = {
      video: result.url,
      public_id: result.publicId,
    };

    await parentDoc.save();

    return NextResponse.json({
      success: true,
      message: "Video updated successfully on Cloudinary",
      video: project.videos[index],
    });
  } catch (err) {
    console.error("Update video error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
