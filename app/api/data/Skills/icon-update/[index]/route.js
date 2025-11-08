import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { uploadFile } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const index = parseInt(params.index);
    const formData = await req.formData();
    const file = formData.get("icon");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const skills = await Skills.findOne();
    if (!skills) {
      return NextResponse.json({ error: "No Skills document found" }, { status: 404 });
    }

    const currentIcon = skills.skIcons[index];
    if (!currentIcon) {
      return NextResponse.json({ error: "Invalid icon index" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(buffer, "skills", currentIcon.public_id);

    skills.skIcons[index] = {
      url: result.url,
      public_id: result.publicId,
    };

    await skills.save();

    return NextResponse.json({
      message: "Icon updated successfully",
      skills,
    });
  } catch (error) {
    console.error("Error updating icon:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
