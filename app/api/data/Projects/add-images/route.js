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

    const files = formData.getAll("images");
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images provided" },
        { status: 400 }
      );
    }

    // Find the document that contains the project
    const projectsDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!projectsDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    // Find the specific project inside the array
    const projectIndex = projectsDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );

    if (projectIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Project not found in array" },
        { status: 404 }
      );
    }

    // Upload images to Cloudinary and prepare objects to push
    const uploadedImages = [];
    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadFile(
          buffer,
          "projects/images",
          null,
          "image"
        );

        uploadedImages.push({
          icon: result.url, // Cloudinary URL
          public_id: result.publicId, // Cloudinary public_id
        });
      }
    }

    // Push new image objects into the project's images array
    projectsDoc.projectsArr[projectIndex].images.push(...uploadedImages);

    // Save the document
    await projectsDoc.save();

    return NextResponse.json({
      success: true,
      message: "Images uploaded and added successfully",
      images: uploadedImages,
    });
  } catch (err) {
    console.error("Add Images Error:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
