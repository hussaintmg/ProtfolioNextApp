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
    const params = await context.params;
    const { id: projectId } = params;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Valid Project ID is required" },
        { status: 400 }
      );
    }

    const parentDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!parentDoc) {
      return NextResponse.json(
        { success: false, message: "Parent project document not found" },
        { status: 404 }
      );
    }

    const projectIndex = parentDoc.projectsArr.findIndex((p) =>
      p._id.equals(projectId)
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Project not found in array" },
        { status: 404 }
      );
    }

    const projectToDelete = parentDoc.projectsArr[projectIndex];

    if (Array.isArray(projectToDelete.images)) {
      for (const img of projectToDelete.images) {
        if (img?.public_id) {
          await cloudinary.uploader.destroy(img.public_id, {
            resource_type: "image",
          });
        }
      }
    }

    if (Array.isArray(projectToDelete.videos)) {
      for (const vid of projectToDelete.videos) {
        if (vid?.public_id) {
          await cloudinary.uploader.destroy(vid.public_id, {
            resource_type: "video",
          });
        }
      }
    }

    parentDoc.projectsArr.splice(projectIndex, 1);
    await parentDoc.save();

    return NextResponse.json({
      success: true,
      message: "Project and associated Cloudinary files deleted successfully",
    });
  } catch (err) {
    console.error("Delete Project Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
