import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "@/models/Home";
import fs from "fs";
import path from "path";

export async function POST(req) {
  await connectDB();
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const link = formData.get("link");
    const colour = formData.get("colour");
    const shape = formData.get("shape");
    const file = formData.get("icon");

    const uploadDir = path.join(process.cwd(), "public/uploads/images");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    let filePath = "";

    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      filePath = `/uploads/images/${filename}`;
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
    }
    const home = await Home.findOne();

    const newSocial = {
      title,
      link,
      icon: filePath,
      colour,
      shape,
    };

    home.socials.push(newSocial);
    await home.save();

    return NextResponse.json({ socials: home.socials }, { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
