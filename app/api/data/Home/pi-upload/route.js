import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const file = formData.get("PI");

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // create unique file name
    const uniqueName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images");

    // ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // save file to disk
    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const PhoneIPath = `/uploads/images/${uniqueName}`;

    // check and delete old logo safely
    const oldData = await Home.findOne();
    if (oldData?.PhoneI && oldData.PhoneI.startsWith("/uploads/")) {
      const oldPath = path.join(process.cwd(), "public", oldData.PhoneI);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // update database
    const homeData = await Home.findOneAndUpdate(
      {},
      { PhoneI: PhoneIPath },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Icon uploaded successfully",
      PhoneI: homeData.PhoneI,
    });
  } catch (err) {
    console.error("Icon upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
