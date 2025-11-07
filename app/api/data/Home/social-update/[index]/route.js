import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "@/models/Home";
import fs from "fs";
import path from "path";

export async function PUT(req, { params }) {
  await connectDB();

  try {
    const index = parseInt(params.index);
    const formData = await req.formData();

    const title = formData.get("title");
    const link = formData.get("link");
    const colour = formData.get("colour");
    const shape = formData.get("shape");
    const file = formData.get("icon");

    const home = await Home.findOne();
    if (!home) {
      return NextResponse.json({ error: "Home not found" }, { status: 404 });
    }

    if (index < 0 || index >= home.socials.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    const social = home.socials[index];

    // Update text fields
    if (title) social.title = title;
    if (link) social.link = link;
    if (colour) social.colour = colour;
    if (shape) social.shape = shape;

    // Handle file upload if new icon provided
    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads/images");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name}`;
      const filePath = `/uploads/images/${filename}`;
      const fullPath = path.join(uploadDir, filename);

      // delete old icon file if exists
      const oldPath = social.icon ? path.join(process.cwd(), "public", social.icon) : null;
      if (oldPath && fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      fs.writeFileSync(fullPath, buffer);
      social.icon = filePath;
    }

    home.socials[index] = social;
    await home.save();

    return NextResponse.json({ message: "Social updated", socials: home.socials }, { status: 200 });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
