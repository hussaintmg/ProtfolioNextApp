import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Projects from "@/models/Projects";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

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

    const projectsDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!projectsDoc) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const imgDir = path.join(process.cwd(), "public", "uploads", "images");
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

    const uploadedImages = [];

    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueName = `${Date.now()}-${file.name}`;
        const filePath = path.join(imgDir, uniqueName);
        fs.writeFileSync(filePath, buffer);
        uploadedImages.push(`/uploads/images/${uniqueName}`);
      }
    }

    const projectIndex = projectsDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );

    projectsDoc.projectsArr[projectIndex].images.push(...uploadedImages);
    await projectsDoc.save();

    return NextResponse.json({
      success: true,
      message: "Images added successfully",
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
