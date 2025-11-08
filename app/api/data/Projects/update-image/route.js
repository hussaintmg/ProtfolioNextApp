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
    const image = formData.get("image");

    if (!projectId || isNaN(index)) {
      return NextResponse.json(
        { success: false, message: "Project ID and valid index are required" },
        { status: 400 }
      );
    }

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
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

    if (index < 0 || index >= project.images.length) {
      return NextResponse.json(
        { success: false, message: "Invalid image index" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const result = await uploadFile(
      buffer,
      "projects/images",
      project.images[index]?.public_id
    );

    if (!result || !result.url || !result.publicId) {
      return NextResponse.json(
        { success: false, message: "Cloudinary upload failed" },
        { status: 500 }
      );
    }

    project.images[index] = {
      icon: result.url,
      public_id: result.publicId,
    };

    await parentDoc.save();

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
      image: project.images[index],
    });
  } catch (err) {
    console.error("Update image error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
