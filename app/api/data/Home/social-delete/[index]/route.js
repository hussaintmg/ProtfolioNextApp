import { NextResponse } from "next/server";
import Home from "@/models/Home";
import connectDB from "@/lib/mongodb";
import { cloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const idx = parseInt(params.index);
    const home = await Home.findOne();
    if (!home) {
      return NextResponse.json({ error: "Home not found" }, { status: 404 });
    }

    if (idx < 0 || idx >= home.socials.length) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    const socialItem = home.socials[idx];

    if (socialItem.iconPublicId) {
      try {
        await cloudinary.uploader.destroy(socialItem.iconPublicId);
      } catch (err) {
        console.warn("Failed to delete from Cloudinary:", err.message);
      }
    }

    home.socials.splice(idx, 1);
    await home.save();

    return NextResponse.json(
      {
        message: "Social deleted successfully",
        socials: home.socials,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
