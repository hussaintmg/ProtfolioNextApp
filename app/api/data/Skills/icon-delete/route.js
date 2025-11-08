import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
  await connectDB();
  try {
    const { index } = await req.json();

    if (index === undefined || index === null) {
      return NextResponse.json({ error: "Index missing" }, { status: 400 });
    }

    const skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      return NextResponse.json({ error: "Skills document not found" }, { status: 404 });
    }

    if (index < 0 || index >= skillsDoc.skIcons.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    const iconToDelete = skillsDoc.skIcons[index];

    // Delete from Cloudinary using public_id
    if (iconToDelete.public_id) {
      await cloudinary.uploader.destroy(iconToDelete.public_id, { resource_type: "image" });
    }

    // Remove the icon object from the array
    skillsDoc.skIcons.splice(index, 1);
    await skillsDoc.save();

    return NextResponse.json({
      message: "Icon deleted successfully",
      skills: skillsDoc,
    });
  } catch (error) {
    console.error("Error deleting icon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
