import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "@/models/Home";
import { uploadFile, cloudinary } from "@/lib/cloudinary";

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

    // Handle file upload via Cloudinary
    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());

      // upload new icon
      const { url, publicId } = await uploadFile(buffer, "socials",social.iconPublicId);
      social.icon = url;
      social.iconPublicId = publicId;
    }

    home.socials[index] = social;
    await home.save();

    return NextResponse.json(
      { message: "Social updated", socials: home.socials },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
