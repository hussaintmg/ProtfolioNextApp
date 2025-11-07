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
    const index = formData.get("index");
    const image = formData.get("image");

    if (!projectId || index === undefined)
      return NextResponse.json(
        { success: false, message: "Project ID and index are required" },
        { status: 400 }
      );

    if (!(image instanceof File))
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );

    // find the document that contains the project
    const parentDoc = await Projects.findOne({
      "projectsArr._id": new mongoose.Types.ObjectId(projectId),
    });

    if (!parentDoc)
      return NextResponse.json(
        { success: false, message: "Project not found in projectsArr" },
        { status: 404 }
      );

    // find index of the nested project
    const projectIndex = parentDoc.projectsArr.findIndex(
      (p) => p._id.toString() === projectId
    );

    if (projectIndex === -1)
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );

    // ensure uploads folder exists
    const imgDir = path.join(process.cwd(), "public", "uploads", "images");
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

    // delete old image if present
    const oldImgPath = parentDoc.projectsArr[projectIndex].images[index];
    if (oldImgPath) {
      const oldFullPath = path.join(process.cwd(), "public", oldImgPath);
      if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);
    }

    // save new image
    const buffer = Buffer.from(await image.arrayBuffer());
    const uniqueName = `${Date.now()}-${image.name}`;
    const newPath = path.join(imgDir, uniqueName);
    fs.writeFileSync(newPath, buffer);
    const publicPath = `/uploads/images/${uniqueName}`;

    // update nested image
    parentDoc.projectsArr[projectIndex].images[index] = publicPath;

    await parentDoc.save();

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
      image: publicPath,
    });
  } catch (err) {
    console.error("Update image error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
