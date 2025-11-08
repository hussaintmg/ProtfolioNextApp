import connectDB from "@/lib/mongodb";
import Skills from "@/models/Skills";
import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectDB();
  try {
    const formData = await req.formData();
    const file = formData.get("icon");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(buffer, "skills");

    const newIcon = {
      url: result.url,        // fixed from result.secure_url
      public_id: result.publicId, // fixed from result.public_id
    };

    let skillsDoc = await Skills.findOne();
    if (!skillsDoc) {
      skillsDoc = await Skills.create({ skIcons: [newIcon] });
    } else {
      skillsDoc.skIcons.push(newIcon);
      await skillsDoc.save();
    }

    return NextResponse.json({
      message: "Icon uploaded successfully",
      skills: skillsDoc,
    });
  } catch (err) {
    console.error("Icon upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
