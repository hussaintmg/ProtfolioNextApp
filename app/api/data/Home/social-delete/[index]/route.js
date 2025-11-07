import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "@/models/Home";
import fs from "fs";
import path from "path";

function deleteFileIfExists(filePath) {
  try {
    const absolutePath = path.join(process.cwd(), "public", filePath);
    if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
  } catch (err) {
    console.error("File delete error:", err);
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { index } = params;
    const idx = parseInt(index);

    const home = await Home.findOne();
    if (!home) {
      return NextResponse.json({ error: "Home not found" }, { status: 404 });
    }

    if (idx < 0 || idx >= home.socials.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    const iconPath = home.socials[idx]?.icon;
    if (iconPath) deleteFileIfExists(iconPath);

    home.socials.splice(idx, 1);
    await home.save();

    return NextResponse.json({ socials: home.socials }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
