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

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const projectId = parseInt(params.projectId);
    const imgIndex = parseInt(params.index);

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

    // Get Cloudinary public_id
    const image = project.images[imgIndex];
    const publicId = image.public_id;

    if (!publicId) {
      return NextResponse.json(
        { message: "No public_id found for image" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from DB
    project.images.splice(imgIndex, 1);
    await projectsDoc.save();

    return NextResponse.json({
      message: "Image deleted successfully from Cloudinary and database",
      project,
    });
  } catch (err) {
    console.error("Delete Image Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
