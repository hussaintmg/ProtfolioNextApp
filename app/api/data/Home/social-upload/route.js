import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Home from "@/models/Home";
import { uploadFile } from "@/lib/cloudinary";

export async function POST(req) {
  await connectDB();

  try {
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

    let iconUrl = "";
    let iconPublicId = "";

    // Upload to Cloudinary if file is present
    if (file && typeof file === "object") {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { url, publicId } = await uploadFile(buffer, "socials");
      iconUrl = url;
      iconPublicId = publicId;
    }

    const newSocial = {
      title,
      link,
      icon: iconUrl,
      iconPublicId,
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
